export const getCommentsData = async () => {
  return [
    {
      _id: "10",
      user: {
        _id: "a",
        name: "Vikram Rout",
        // image: '/'
      },
      desc: "it was a nice post, thank you",
      post: "1",
      parent: null,
      replyOnUser: null,
      createdAt: "2022-12-31-T17:22:05.092+0000",
    },
    {
      _id: "11",
      user: {
        _id: "b",
        name: "traniker train",
      },
      desc: "a reply to vikram Rout",
      post: "1",
      parent: 10,
      replyOnUser: "a",
      createdAt: "2022-12-31-T17:22:05.092+0000",
    },
    {
      _id: "12",
      user: {
        _id: "b",
        name: "nikhil shuffle",
      },
      desc: " nice post dude",
      post: "1",
      parent: null,
      replyOnUser: null,
      createdAt: "2022-12-31-T17:22:05.092+0000",
    },

    {
      _id: "13",
      user: {
        _id: "c",
        name: "Vikrant Rout",
      },
      desc: " thank you",
      post: "1",
      parent: null,
      replyOnUser: null,
      createdAt: "2022-12-31-T17:22:05.092+0000",
    },
  ];
};
