//--- Tính năng của trang Quản lí sản phẩm ----

//Tính năng lọc trạng thái sản phẩm
const boxFilter = document.querySelector("[box-filter]");
if (boxFilter) {
  const newUrl = new URL(location.href);

  boxFilter.addEventListener("change", (e) => {
    const filterValue = e.target.value;
    if (filterValue) {
      newUrl.searchParams.set("status", filterValue);
    } else {
      newUrl.searchParams.delete("status");
    }

    location.href = newUrl;
  });

  const currentStatus = newUrl.searchParams.get("status");
  if (currentStatus) {
    boxFilter.value = currentStatus;
  }
}

//Tính năng tìm kiếm
const formSearch = document.querySelector("[form-search]");
if (formSearch) {
  const newUrl = new URL(location.href);

  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    const textInput = e.target.keyword.value;
    if (textInput) {
      newUrl.searchParams.set("keyword", textInput);
    } else {
      newUrl.searchParams.delete("keyword");
    }

    location.href = newUrl;
  });

  const currentKeyword = newUrl.searchParams.get("keyword");
  if (currentKeyword) {
    formSearch.keyword.value = currentKeyword;
  }
}

//Tính năng phân trang
const pageList = document.querySelectorAll(".page-link");
if (pageList.length > 0) {
  const newUrl = new URL(location.href);

  pageList.forEach((page) => {
    page.addEventListener("click", () => {
      const clickedPage = page.getAttribute("button-pagination");
      if (clickedPage) {
        newUrl.searchParams.set("page", clickedPage);
      } else {
        newUrl.searchParams.delete("page");
      }

      location.href = newUrl;
    });
  });

  const currentPage = newUrl.searchParams.get("page");
  pageList.forEach((page) => {
    if (page.getAttribute("button-pagination") === currentPage) {
      page.parentNode.classList.add("active");
    }
  });
}

//Tính năng thay đổi trạng thái một sản phẩm
const buttonChangeStatus = document.querySelectorAll("[button-change-status]");
if (buttonChangeStatus.length > 0) {
  buttonChangeStatus.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const dataPath = button.getAttribute("data-path");
      const incomingChangeStatus = button.getAttribute("button-change-status");
      const itemId = button.getAttribute("item-id");
      const data = { id: itemId, status: incomingChangeStatus };
      // console.log({dataPath, data});
      
      axios.patch(dataPath, data).then((res) => {
        console.log(res);
        if (res.status === 200) {
          location.reload();
        }
      });
    });
  });
}

//Tính năng thay đổi trạng thái của nhiều sản phẩm
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
  formChangeMulti.addEventListener("submit", (e) => {
    e.preventDefault();

    const dataPath = formChangeMulti.getAttribute("data-path");
    console.log(dataPath);
    const incomingChangeStatus = e.target.status.value;
    const inputChange = document.querySelectorAll("[input-change]");

    const checkedInputChange = Array.from(inputChange).reduce((acc, curr) => {
      if (curr.checked) {
        return [...acc, curr.getAttribute("item-id")];
      }
      return acc;
    }, []);

    const data = {
      ids: checkedInputChange,
      status: incomingChangeStatus,
    };

    axios.patch(dataPath, data).then((res) => {
      if (res.status === 200) {
        location.reload();
      }
    });
  });
}

//Tính năng xoá sản phẩm
const buttonDelete = document.querySelectorAll("[button-delete]");
if (buttonDelete.length > 0) {
  buttonDelete.forEach((button) => {
    button.addEventListener("click", () => {
      const dataPath = button.getAttribute("data-path");
      const itemId = button.getAttribute("item-id");

      axios.patch(dataPath, { id: itemId }).then((res) => {
        if (res.status === 200) {
          location.reload();
        }
      });
    });
  });
}

//Tính năng thay đổi vị trí sản phẩm
const inputPosition = document.querySelectorAll("[input-position]");
if (inputPosition.length > 0) {
  inputPosition.forEach((input) => {
    input.addEventListener("change", (e) => {
      const itemId = input.getAttribute("item-id");
      const dataPath = input.getAttribute("data-path");
      const position = e.target.value;

      axios.patch(dataPath, { id: itemId, position: position }).then((res) => {
        if (res.status === 200) {
          location.reload();
        }
      });
    });
  });
}

//Tính năng thông báo
const alertMessage = document.querySelector("[alert-message]");
if (alertMessage) {
  setTimeout(() => {
    alertMessage.style.display = "none";
  }, 3000);
}

//Tính năng Preview ảnh
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
  const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
  const uploadImagePreview = uploadImage.querySelector(
    "[upload-image-preview]"
  );

  uploadImageInput.addEventListener("change", () => {
    const file = uploadImageInput.files[0];
    if (file) {
      uploadImagePreview.src = URL.createObjectURL(file);
    }
  });
}

//Tính năng sắp xếp theo tiêu chí
const sortSelect = document.querySelector("[sort-select]");
if (sortSelect) {
  console.log(sortSelect);
  const newUrl = new URL(location.href);
  sortSelect.addEventListener("change", (e) => {
    const value = e.target.value;

    if (value) {
      const [sortKey, sortValue] = value.split("-");
      newUrl.searchParams.set("sortKey", sortKey);
      newUrl.searchParams.set("sortValue", sortValue);
    } else {
      newUrl.searchParams.delete("sortKey");
      newUrl.searchParams.delete("sortValue");
    }

    location.href = newUrl;
  });

  const currentSortKey = newUrl.searchParams.get("sortKey");
  const currentSortValue = newUrl.searchParams.get("sortValue");

  if (currentSortKey && currentSortValue) {
    sortSelect.value = `${currentSortKey}-${currentSortValue}`;
  }
}

//Tính năng phân quyền
const tablePermissions = document.querySelector("[table-permissions]");
if (tablePermissions) {
  const buttonSubmit = document.querySelector("[button-submit]");
  if (buttonSubmit) {
    const dataFinal = [];
    buttonSubmit.addEventListener("click", () => {
      const roleId = tablePermissions.querySelectorAll("[role-id]");
      roleId.forEach((elementRoleId) => {
        const id = elementRoleId.getAttribute("role-id");
        const permissions = [];

        const permissionsCheckedInput = tablePermissions.querySelectorAll(
          `[data-id="${id}"]:checked`
        );

        permissionsCheckedInput.forEach((input) => {
          const tr = input.closest("[data-name]");
          const permission = tr.getAttribute("data-name");
          permissions.push(permission);
        });

        dataFinal.push({
          id: id,
          permissions: permissions,
        });
      });

      const path = buttonSubmit.getAttribute("data-path");
      axios.patch(path, dataFinal).then((res) => {
        if (res.status === 200) {
          location.reload();
        }
      });
    });
  }

  //Tính năng hiển thị bảng phân quyền
  let dataPermissions = tablePermissions.getAttribute("table-permissions");
  dataPermissions = JSON.parse(dataPermissions);
  dataPermissions.forEach((item) => {
    item.permissions.forEach((permission) => {
      const input = document.querySelector(
        `tr[data-name="${permission}"] input[data-id="${item._id}"]`
      );
      input.checked = true;
    });
  });
}

//Tính năng hiển thị bảng phân quyền trong trang chi tiết
const tableDetail = document.querySelector("[table-detail]");
if (tableDetail) {
  let detailDataPermissions = tableDetail.getAttribute("table-detail");
  detailDataPermissions = JSON.parse(detailDataPermissions);
  detailDataPermissions.permissions.forEach((permission) => {
    const input = document.querySelector(
      `tr[data-name="${permission}"] input[data-id="${detailDataPermissions._id}"]`
    );
    if (input) {
      input.checked = true;
    }
    console.log(input);
  });
}

//--------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------

//--- Tính năng của trang thùng rác---

//Tính năng khôi phục sản phẩm
const buttonRestore = document.querySelectorAll("[button-restore]");
if (buttonRestore.length > 0) {
  buttonRestore.forEach((button) => {
    button.addEventListener("click", () => {
      const dataPath = button.getAttribute("data-path");
      const itemId = button.getAttribute("item-id");

      axios.patch(dataPath, { id: itemId }).then((res) => {
        console.log({ res });
        if (res.status === 200) {
          location.reload();
        }
      });
    });
  });
}

//Tính năng khôi phục nhiều sản phẩm
const formRestoreDestroy = document.querySelector("[form-restore-destroy]");
if (formRestoreDestroy) {
  const dataPaths = formRestoreDestroy.getAttribute("data-path").split("||");
  let url;

  formRestoreDestroy.addEventListener("submit", (e) => {
    e.preventDefault();
    const status = e.target.status.value;
    url = status === "restore" ? dataPaths[0] : dataPaths[1];
    const inputChange = document.querySelectorAll("[input-change]");

    const checkedInputChange = Array.from(inputChange).reduce((acc, curr) => {
      if (curr.checked) {
        return [...acc, curr.getAttribute("item-id")];
      }
      return acc;
    }, []);

    const data = {
      ids: checkedInputChange,
      status: status,
    };
    axios.patch(url, data).then((res) => {
      if (res.status === 200) {
        location.reload();
      }
    });
  });
}

//Tính năng xoá vĩnh viễn sản phẩm
