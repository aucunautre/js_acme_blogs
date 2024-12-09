// INF 651 Final Project!

// ------------------------------------------------------------------
// 1. createElemWithText
// ------------------------------------------------------------------

function createElemWithText(elementType = "p", textContent = "", className) {
  const element = document.createElement(elementType);
  element.textContent = textContent;

  if (className) {
    element.className = className;
  }

  return element;
}

// ------------------------------------------------------------------
// 2. createSelectOptions
// ------------------------------------------------------------------

function createSelectOptions(users) {
  if (!users) return;

  const options = users.map((user) => {
    const option = document.createElement("option");
    option.value = user.id;
    option.textContent = user.name;
    return option;
  });

  return options;
}

// ------------------------------------------------------------------
// 3. toggleCommentSection
// ------------------------------------------------------------------

function toggleCommentSection(postId) {
  if (!postId) return;

  const section = document.querySelector(`section[data-post-id="${postId}"]`);

  if (!section) return null;

  section.classList.toggle("hide");

  return section;
}

// ------------------------------------------------------------------
// 4. toggleCommentButton
// ------------------------------------------------------------------

function toggleCommentButton(postId) {
  if (!postId) return;

  const button = document.querySelector(`button[data-post-id="${postId}"]`);
  if (!button) return null;

  button.textContent =
    button.textContent === "Show Comments" ? "Hide Comments" : "Show Comments";

  return button;
}

// ------------------------------------------------------------------
// 5. deleteChildElements
// ------------------------------------------------------------------

function deleteChildElements(parentElement) {
  if (!(parentElement instanceof HTMLElement)) return;

  let child = parentElement.lastElementChild;

  while (child) {
    parentElement.removeChild(child);
    child = parentElement.lastElementChild;
  }

  return parentElement;
}

// ------------------------------------------------------------------
// 6. addButtonListeners
// ------------------------------------------------------------------

function addButtonListeners() {
  const buttons = document.querySelectorAll("main button");

  buttons.forEach((button) => {
    const postId = button.dataset.postId;

    if (postId) {
      button.addEventListener("click", function (event) {
        toggleComments(event, postId);
      });
    }
  });

  return buttons;
}

// ------------------------------------------------------------------
// 7. removeButtonListeners
// ------------------------------------------------------------------

function removeButtonListeners() {
  const buttons = document.querySelectorAll("main button");

  buttons.forEach((button) => {
    const postId = button.dataset.id;

    if (postId) {
      button.removeEventListener("click", function () {
        toggleComments(event, postId);
      });
    }
  });

  return buttons;
}

// ------------------------------------------------------------------
// 8. createComments
// ------------------------------------------------------------------

function createComments(comments) {
  if (!comments) return;

  const fragment = document.createDocumentFragment();

  comments.forEach((comment) => {
    const article = document.createElement("article");
    const h3 = createElemWithText("h3", comment.name);
    const pBody = createElemWithText("p", comment.body);
    const pEmail = createElemWithText("p", `From: ${comment.email}`);

    article.appendChild(h3);
    article.appendChild(pBody);
    article.appendChild(pEmail);

    fragment.appendChild(article);
  });

  return fragment;
}

// ------------------------------------------------------------------
// 9. populateSelectMenu
// ------------------------------------------------------------------

function populateSelectMenu(users) {
  if (!users) return;

  const selectMenu = document.getElementById("selectMenu");

  const options = createSelectOptions(users);

  options.forEach((option) => {
    selectMenu.appendChild(option);
  });

  return selectMenu;
}

// ------------------------------------------------------------------
// 10. getUsers
// ------------------------------------------------------------------

async function getUsers() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");

    if (!response.ok) {
      throw new Error("Uh oh, le network n'est pas bon !");
    }

    const usersData = await response.json();

    return usersData;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

// ------------------------------------------------------------------
// 11. getUserPosts
// ------------------------------------------------------------------

async function getUserPosts(userId) {
  if (!userId) return;

  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
    );

    if (!response.ok) {
      throw new Error("Uh oh, le network n'est pas bon !");
    }

    const posts = await response.json();

    return posts;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

// ------------------------------------------------------------------
// 12. getUser
// ------------------------------------------------------------------

async function getUser(userId) {
  if (!userId) return;

  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users/${userId}`
    );

    if (!response.ok) {
      throw new Error("Uh oh, le network n'est pas bon !");
    }

    const userData = await response.json();

    return userData;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

// ------------------------------------------------------------------
// 13. getPostComments
// ------------------------------------------------------------------

async function getPostComments(postId) {
  if (!postId) return;

  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const commentsData = await response.json();

    return commentsData;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

// ------------------------------------------------------------------
// 14. displayComments
// ------------------------------------------------------------------

async function displayComments(postId) {
  if (!postId) return;

  try {
    const section = document.createElement("section");

    section.dataset.postId = postId;

    section.classList.add("comments", "hide");

    const comments = await getPostComments(postId);

    const fragment = createComments(comments);

    section.appendChild(fragment);

    return section;
  } catch (error) {
    console.error("Error displaying comments:", error);
  }
}

// ------------------------------------------------------------------
// 15. createPosts
// ------------------------------------------------------------------

async function createPosts(posts) {
  if (!posts) return;

  try {
    const fragment = document.createDocumentFragment();

    for (const post of posts) {
      const article = document.createElement("article");
      const title = createElemWithText("h2", post.title);
      const body = createElemWithText("p", post.body);
      const postId = createElemWithText("p", `Post ID: ${post.id}`);
      const author = await getUser(post.userId);
      const authorInfo = createElemWithText(
        "p",
        `Author: ${author.name} with ${author.company.name}`
      );
      const companyCatchPhrase = createElemWithText(
        "p",
        `${author.company.catchPhrase}`
      );

      const showCommentsButton = document.createElement("button");
      showCommentsButton.textContent = "Show Comments";
      showCommentsButton.dataset.postId = post.id;

      article.appendChild(title);
      article.appendChild(body);
      article.appendChild(postId);
      article.appendChild(authorInfo);
      article.appendChild(companyCatchPhrase);
      article.appendChild(showCommentsButton);

      const section = await displayComments(post.id);
      article.appendChild(section);

      fragment.appendChild(article);
    }

    return fragment;
  } catch (error) {
    console.error("Error creating posts:", error);
  }
}

// ------------------------------------------------------------------
// 16. displayPosts
// ------------------------------------------------------------------

async function displayPosts(posts) {
  const main = document.querySelector("main");

  const element =
    posts && posts.length > 0
      ? await createPosts(posts)
      : document.createElement("p");

  if (!posts || posts.length === 0) {
    element.textContent = "Select an Employee to display their posts."; // Adjusted to match the expected text
    element.classList.add("default-text");
  }

  main.appendChild(element);

  return element;
}

// ------------------------------------------------------------------
// 17. toggleComments
// ------------------------------------------------------------------

function toggleComments(event, postId) {
  try {
    // Check if either `event` or `postId` is missing, return undefined
    if (!event || !postId) return;

    // Ensure `event.target` exists before setting any property
    if (event.target) {
      event.target.listener = true;
    }

    const section = toggleCommentSection(postId);
    const button = toggleCommentButton(postId);

    // Check if the results are valid and return them as an array
    if (section && button) {
      return [section, button];
    }
  } catch (error) {
    console.error("Error toggling comments:", error);
    return undefined;
  }
}

// ------------------------------------------------------------------
// 18. refreshPosts
// ------------------------------------------------------------------

async function refreshPosts(posts) {
  if (!posts) return;

  const buttons = removeButtonListeners();
  const myMain = deleteChildElements(document.querySelector("main"));
  const fragment = await displayPosts(posts);
  const button = addButtonListeners();

  return [buttons, myMain, fragment, button];
}

// ------------------------------------------------------------------
// 19. selectMenuChangeEventHandler
// ------------------------------------------------------------------

async function selectMenuChangeEventHandler(event) {
  if (!event) return;

  const selectMenu = event.target;
  const userId =
    selectMenu?.value === "Employees" || !selectMenu?.value
      ? 1
      : selectMenu?.value;

  if (selectMenu !== undefined) selectMenu.disabled = true;

  const posts = await getUserPosts(userId);
  const refreshPostsArray = await refreshPosts(posts);

  if (selectMenu) selectMenu.disabled = false;

  return [userId, posts, refreshPostsArray];
}

// ------------------------------------------------------------------
// 20. initPage
// ------------------------------------------------------------------

async function initPage() {
  const users = await getUsers();
  const select = populateSelectMenu(users);

  return [users, select];
}

// ------------------------------------------------------------------
// 21. initApp
// ------------------------------------------------------------------

async function initApp() {
  initPage();

  const select = document.getElementById("selectMenu");
  select.addEventListener("change", selectMenuChangeEventHandler);
}

document.addEventListener("DOMContentLoaded", initApp);
