function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchUserProfile() {
  await delay(500);
  if (Math.random() < 0.2) throw new Error("Failed to fetch user profile.");
  return { id: 1, name: "Sully" };
}

async function fetchPosts(userId) {
  await delay(500);
  if (Math.random() < 0.2) throw new Error("Failed to fetch posts.");
  return [
    { id: 101, title: "Post 1", userId },
    { id: 102, title: "Post 2", userId },
  ];
}

async function fetchComments(postId) {
  await delay(1000);
  if (Math.random() < 0.3) throw new Error(`Failed to fetch comments for post ${postId}.`);
  return [
    { id: 201, postId, text: "Nice!" },
    { id: 202, postId, text: "Amazing!" },
  ];
}

async function fetchSequential() {
  console.log("Starting sequential fetch...");
  try {
    const user = await fetchUserProfile();
    console.log("User profile retrieved:", user);

    const posts = await fetchPosts(user.id);
    console.log("Posts retrieved:", posts);

    for (const post of posts) {
      try {
        const comments = await fetchComments(post.id);
        console.log(`Comments for Post ${post.id}:`, comments);
      } catch (err) {
        console.error(err.message);
      }
    }
  } catch (err) {
    console.error("Sequential error:", err.message);
  }
}

async function fetchParallel() {
  console.log("\nStarting parallel fetch...");
  try {
    const [user, posts, comments] = await Promise.all([
      fetchUserProfile(),
      fetchPosts(1),
      fetchComments(101),
    ]);
    console.log("User:", user);
    console.log("Posts:", posts);
    console.log("Sample Comments:", comments);
  } catch (err) {
    console.error("Parallel error:", err.message);
  }
}

async function getUserContent() {
  console.log("\nRunning getUserContent() flow...");
  try {
    const user = await fetchUserProfile();
    console.log("User profile retrieved:", user);

    const posts = await fetchPosts(user.id);
    console.log("Posts retrieved:", posts);

    const allComments = [];
    for (const post of posts) {
      try {
        const comments = await fetchComments(post.id);
        allComments.push(...comments);
        console.log(`Comments for post ${post.id} retrieved.`);
      } catch (err) {
        console.warn(err.message);
      }
    }

    console.log("\n Final Combined Data:");
    console.log({
      user,
      posts,
      comments: allComments,
    });
  } catch (err) {
    console.error("getUserContent error:", err.message);
  }
}

fetchSequential();
fetchParallel();
getUserContent();
