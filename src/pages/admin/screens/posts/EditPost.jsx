import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { getSinglePost, updatePost } from "../../../../services/index/posts";

import { Link, useParams, useNavigate } from "react-router-dom";
import ArticleDetailSkeleton from "../../../articleDetail/components/ArticleDetailSkeleton";
import ErrorMessage from "../../../../components/ErrorMessage";
import { stables } from "../../../../constants";
import { FaCameraRetro } from "react-icons/fa6";
import { RiSparkling2Line } from "react-icons/ri";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import Editor from "../../../../components/editor/Editor";
import MultiSelectTagDropdown from "../../components/select-dropdown/MultiSelectTagDropdown";
import { getAllCategories } from "../../../../services/index/postCategories";
import {
  categoryToOption,
  filterCategories,
} from "../../../../utils/multiSelectTagUtils";
import { getAiApiKey } from "../../../../utils/aiKeyStorage";

const promiseOptions = async (inputValue) => {
  const {data: categoriesData} = await getAllCategories();
  return filterCategories(inputValue, categoriesData);
};

const EditPost = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const userState = useSelector((state) => state.user);
  const { slug } = useParams();
  const [initialPhoto, setInitialPhoto] = useState(null);
  const [body, setBody] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [postSlug, setPostSlug] = useState("");
  const [caption, setCaption] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [editorInstance, setEditorInstance] = useState(null);
  const [aiTarget, setAiTarget] = useState(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryFn: () => getSinglePost({ slug }),
    queryKey: ["blog", slug],
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setIsInitialized(false);
  }, [slug]);

  useEffect(() => {
    if (!data || isInitialized) return;
    setInitialPhoto(data?.photo || null);
    setCategories((data.categories || []).map((item) => item._id));
    setTitle(data.title || "");
    setTags(data.tags || []);
    setCaption(data.caption || "");
    setPostSlug(data.slug || "");
    setBody(data.body || null);
    setIsInitialized(true);
  }, [data, isInitialized]);

  const {
    mutate: mutateUpdatePostDetail,
    isLoading: isLoadingUpdatePostDetail,
  } = useMutation({
    mutationFn: ({ updatedData, slug, token }) => {
      return updatePost({ updatedData, slug, token });
    },
    onSuccess: (data) => {
      // setInitialPhoto(data.photo);  
      queryClient.invalidateQueries(["blog", slug]);
      toast.success("post updated successfully");
      navigate(`/admin/posts/manage/edit/${data.slug}`, { replace: true });
      

    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
  };

  const slugify = (value) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-+|-+$)/g, "");

  const buildAiPrompt = (target, promptText) => {
    const contextLines = [];
    if (title) contextLines.push(`Title: ${title}`);
    if (caption) contextLines.push(`Caption: ${caption}`);
    if (data?.categories?.length) {
      contextLines.push(
        `Categories: ${data.categories.map((cat) => cat.title).join(", ")}`
      );
    }
    if (tags.length) contextLines.push(`Tags: ${tags.join(", ")}`);
    const contextBlock = contextLines.length
      ? `Context:\n${contextLines.join("\n")}\n`
      : "";

    if (target === "title") {
      return `${contextBlock}Write a clear, engaging blog post title. Return only the title text, no quotes or extra formatting.\nUser request: ${promptText}`;
    }
    if (target === "caption") {
      return `${contextBlock}Write a 1-2 sentence caption for the blog post. Return only plain text, no quotes or extra formatting.\nUser request: ${promptText}`;
    }
    if (target === "slug") {
      return `${contextBlock}Create a short URL slug in kebab-case. Return only the slug text (lowercase, hyphen-separated).\nUser request: ${promptText}`;
    }

    return `${contextBlock}Write a complete blog post as HTML only (no Markdown, no code fences). Use headings, paragraphs, bullet lists, and a short blockquote. Use bold (<strong>), italic (<em>), underline (<u>), and a few colored phrases with <span style="color:#..."> for emphasis. Keep it readable and professional.\nUser request: ${promptText}`;
  };

  const extractText = (rawText) =>
    rawText
      .replace(/^```(?:html)?/i, "")
      .replace(/```$/i, "")
      .trim();

  const callGemini = async (promptText) => {
    const apiKey = getAiApiKey();
    if (!apiKey) {
      throw new Error("Please add your API key in Admin > API Key first.");
    }
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: promptText }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message =
        errorData?.error?.message || "Failed to generate AI content";
      throw new Error(message);
    }

    const data = await response.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.map((part) => part.text).join("") ||
      "";
    return extractText(text);
  };

  const openAiPrompt = (target) => {
    const apiKey = getAiApiKey();
    if (!apiKey) {
      toast.error("Add your Gemini API key in Admin > API Key first.");
      return;
    }
    setAiTarget(target);
    setAiPrompt("");
  };

  const closeAiPrompt = () => {
    setAiTarget(null);
    setAiPrompt("");
  };

  const handleAiGenerate = async () => {
    if (!aiTarget) return;
    if (!aiPrompt.trim() && !title && !caption) {
      toast.error("Please enter a short prompt for the AI.");
      return;
    }
    setIsAiGenerating(true);
    try {
      const promptText = buildAiPrompt(aiTarget, aiPrompt.trim());
      const result = await callGemini(promptText);

      if (aiTarget === "title") {
        setTitle(result);
      } else if (aiTarget === "caption") {
        setCaption(result);
      } else if (aiTarget === "slug") {
        setPostSlug(slugify(result));
      } else if (aiTarget === "body") {
        if (editorInstance) {
          editorInstance.commands.setContent(result);
        } else {
          toast.error("Editor is still loading. Please try again.");
          return;
        }
      }
      closeAiPrompt();
      toast.success("AI content generated");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleUpdatePost = async () => {
    let updatedData = new FormData();

    if (!initialPhoto && photo) {
      updatedData.append("postPicture", photo);
    } else if (initialPhoto && !photo) {
      const urlToObject = async (url) => {
        let reponse = await fetch(url);
        let blob = await reponse.blob();
        const file = new File([blob], initialPhoto, { type: blob.type });
        return file;
      };
      const picture = await urlToObject(
        data.photo.startsWith("http")
          ? data.photo
          : stables.UPLOAD_FOLDER_BASE_URL + data.photo
      );


      updatedData.append("postPicture", picture);
    }

    updatedData.append(
      "document",
      JSON.stringify({
        body,
        categories,
        title,
        tags,
        slug: postSlug || data?.slug,
        caption,
      })
    );

    mutateUpdatePostDetail({
      updatedData,
      slug,
      token: userState.userInfo.token,
    });
  };

  const handleDeleteImage = () => {
    if (window.confirm("Are you sure you want to delete")) {
      setInitialPhoto(null);
      setPhoto(null);
    }
  };

  let isPostDataLoaded = !isLoading && !isError;
  const aiTargetLabel = aiTarget === "body" ? "content" : aiTarget;

  return (
    <div>
      {isLoading ? (
        <ArticleDetailSkeleton />
      ) : isError ? (
        <ErrorMessage message="sorry for incov..could not fetch the post detail " />
      ) : (
        <section className="container mx-auto max-w-5xl flex flex-col px-3 py-5 lg:flex-row lg:gap-x-5 lg:items-start">
          <article className="flex-1">
            <label htmlFor="postPicture" className="w-full cursor-pointer ">
              {photo ? (
                <img
                  src={URL.createObjectURL(photo)}
                  alt={data?.title}
                  className="rounded-xl w-full "
                />
              ) : initialPhoto ? (
                <img
                  src={
                    data?.photo.startsWith("http")
                      ? data.photo
                      : stables.UPLOAD_FOLDER_BASE_URL + data.photo
                  }
                  alt={data?.title}
                  className="rounded-xl w-full "
                />

              ) : (
                <div className="w-full min-h-[200px] bg-yellow-50/50 flex justify-center items-center">
                  <FaCameraRetro className="w-7 h-auto text-primary" />
                </div>
              )}
            </label>
            <input
              type="file"
              className="sr-only"
              id="postPicture"
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={handleDeleteImage}
              className="w-fit bg-red-500 text-sm text-white font-semibold rounded-lg px-4 py-2 mt-5 ml-[800px]"
            >
              Delete image
            </button>
            <div className="mt-4 flex gap-3">
              {data?.categories.map((category) => (
                <Link
                  to={`/blog?category=${category.title}`}
                  className="text-primary text-sm font-rob inline-block  md:text-base"
                >
                  {category.title}
                </Link>
              ))}
            </div>
            <div className="d-form-control w-full ">
              <div className="d-label flex items-center justify-between">
                <label htmlFor="title" className="d-label-text">
                  Title
                </label>
                <button
                  type="button"
                  onClick={() => openAiPrompt("title")}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-dark-hard transition hover:border-slate-500 dark:border-[#2a2a2a] dark:text-slate-100"
                >
                  <RiSparkling2Line className="h-3 w-3" /> AI
                </button>
              </div>
              <input
                id="title"
                value={title}
                className="d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-rob font-medium text-dark-hard "
                onChange={(e) => setTitle(e.target.value)}
                placeholder="title"
              />
            </div>
            <div className="d-form-control w-full ">
              <div className="d-label flex items-center justify-between">
                <label htmlFor="caption" className="d-label-text">
                  Caption
                </label>
                <button
                  type="button"
                  onClick={() => openAiPrompt("caption")}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-dark-hard transition hover:border-slate-500 dark:border-[#2a2a2a] dark:text-slate-100"
                >
                  <RiSparkling2Line className="h-3 w-3" /> AI
                </button>
              </div>
              <input
                id="captions"
                value={caption}
                className="d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-rob font-medium text-dark-hard "
                onChange={(e) => setCaption(e.target.value)}
                placeholder="captions"
              />
            </div>
            <div className="d-form-control w-full ">
              <div className="d-label flex items-center justify-between">
                <label htmlFor="slug" className="d-label-text">
                  Slug
                </label>
                <button
                  type="button"
                  onClick={() => openAiPrompt("slug")}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-dark-hard transition hover:border-slate-500 dark:border-[#2a2a2a] dark:text-slate-100"
                >
                  <RiSparkling2Line className="h-3 w-3" /> AI
                </button>
              </div>
              <input
                id="slug"
                value={postSlug}
                className="d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-rob font-medium text-dark-hard "
                onChange={(e) => setPostSlug(e.target.value.replace(/\s+/g, "-").toLowerCase())}
                placeholder="post slug"
              />
            </div>
            <div className="mb-5 mt-2 ">
              <label className="d-label ">
                <span className="d-label-text ">Categories</span>
              </label>
              {isPostDataLoaded && (
                <MultiSelectTagDropdown
                  loadOptions={promiseOptions}
                  defaultValue={data.categories.map(categoryToOption)}
                  onChange={(newValue) =>
                    setCategories(newValue.map((item) => item.value))
                  }
                />
              )}
            </div>
            <div className="mb-5 mt-2 ">
              <label className="d-label ">
                <span className="d-label-text ">Tags</span>
              </label>
              {isPostDataLoaded && (
                <CreatableSelect
                  defaultValue={data.tags.map((tags) => ({
                    value: tags,
                    label: tags,
                  }))}
                  isMulti
                  onChange={(newValue) =>
                    setTags(newValue.map((item) => item.value))
                  }
                  className="relative z-20"
                />
              )}
            </div>
            <div className="w-full ">
              <div className="d-label flex items-center justify-between">
                <span className="d-label-text">Content</span>
                <button
                  type="button"
                  onClick={() => openAiPrompt("body")}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-dark-hard transition hover:border-slate-500 dark:border-[#2a2a2a] dark:text-slate-100"
                >
                  <RiSparkling2Line className="h-3 w-3" /> AI
                </button>
              </div>
              {isPostDataLoaded && (
                <Editor
                  content={body || data?.body}
                  editable={true}
                  onEditorReady={setEditorInstance}
                  onDataChange={(data) => {
                    setBody(data);
                  }}
                />
              )}
            </div>
            <button
              disabled={isLoadingUpdatePostDetail}
              type="button"
              onClick={handleUpdatePost}
              className="w-full bg-emerald-400 text-white font-semibold rounded-lg px-4 py-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Update Post
            </button>
          </article>
        </section>
      )}
      {aiTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-[#1f1f1f] dark:bg-[#0d0d0d]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-dark-hard">
                  AI Assist
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Tell the AI what you want for{" "}
                  <span className="font-semibold">{aiTargetLabel}</span>.
                </p>
              </div>
              <button
                type="button"
                onClick={closeAiPrompt}
                className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-dark-hard transition hover:border-slate-500 dark:border-[#2a2a2a] dark:text-slate-100"
              >
                Close
              </button>
            </div>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              rows={4}
              placeholder="e.g. Write a friendly intro about sustainable travel for beginners."
              className="mt-4 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-dark-hard outline-none transition focus:border-slate-500 dark:border-[#2a2a2a] dark:bg-[#111111] dark:text-slate-100"
            />
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleAiGenerate}
                disabled={isAiGenerating}
                className="rounded-lg bg-emerald-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isAiGenerating ? "Generating..." : "Generate"}
              </button>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                The AI will format content with bold, italic, underline, and
                colored highlights.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPost;
