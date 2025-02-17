export const categoryToOption = (category) => ({
  value: category._id,
  label: category.title,
});

export const filterCategories = (inputVlaue, categoriesData) => {
  // console.log("categorydata before converting:", categoriesData);
  const filteredOptions = categoriesData
    .map(categoryToOption)
    .filter((category) => category.label.toLowerCase().includes(inputVlaue.toLowerCase()));
    // console.log("categorydata after converting:", filteredOptions);
    return filteredOptions;
};
