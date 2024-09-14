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

      axios.patch(dataPath, data).then((res) => {
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
        if (res.status === 200){
          location.reload();
        }
      });
    });
  });
}
