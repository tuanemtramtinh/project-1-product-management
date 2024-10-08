const createCategoryHierarchy = (categoryList, parentId = "") => {
  const newArray = [];
  for (const category of categoryList) {
    if(category.parent_id == parentId) {
      const children = createCategoryHierarchy(categoryList, category._id);
      if(children.length > 0) {
        category.children = children;
      }
      newArray.push(category);
    }
  }
  // console.log(newArray);
  return newArray;
}

module.exports.getAllCategory = (categoryList, parentId = "") => {
  const categoryHierarchy = createCategoryHierarchy(categoryList, parentId);
  return categoryHierarchy;
}
