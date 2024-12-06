import React, { useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import axios from "axios";

// Initialize QueryClient
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <PostManager />
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 18, color: "red" }}>
            Something went wrong. Please try again.
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

// Main Post Manager Component
function PostManager() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [userId, setUserId] = useState("");
  const [filterUserId, setFilterUserId] = useState("");

  // Fetch Posts
  const fetchPosts = async ({ queryKey }) => {
    const [_key, userId] = queryKey;
    const url = userId
      ? `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
      : `https://jsonplaceholder.typicode.com/posts`;

    const response = await axios.get(url);
    if (!response || !response.data) {
      throw new Error("Failed to fetch posts");
    }
    return response.data;
  };

  const {
    data: posts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["posts", filterUserId],
    queryFn: fetchPosts,
  });

  // Create Post
  const createPostMutation = useMutation({
    mutationFn: async (newPost) => {
      const { data } = await axios.post(
        "https://jsonplaceholder.typicode.com/posts",
        newPost
      );
      return data;
    },
    onSuccess: (newPost) => {
      // Update local cache manually
      queryClient.setQueryData(["posts", filterUserId], (oldData) => [
        ...(oldData || []),
        newPost,
      ]);
    },
  });

  const handleCreatePost = () => {
    // Prevent creating multiple posts accidentally
    if (!title || !body || !userId) {
      alert("Please fill in all fields!");
      return;
    }

    createPostMutation.mutate(
      { title, body, userId: parseInt(userId) },
      {
        onSuccess: (newPost) => {
          queryClient.setQueryData(["posts", filterUserId], (oldData) => [
            ...(oldData || []),
            newPost,
          ]);
        },
      }
    );

    setTitle("");
    setBody("");
    setUserId("");
  };

  // UI Rendering
  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View style={{ padding: 20, flex: 1 }}>
      <Text style={{ fontSize: 24 }}>Manage Blog Posts</Text>

      {/* Create/Filter Form */}
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, marginVertical: 5, padding: 10 }}
      />
      <TextInput
        placeholder="Body"
        value={body}
        onChangeText={setBody}
        style={{ borderWidth: 1, marginVertical: 5, padding: 10 }}
      />
      <TextInput
        placeholder="User ID"
        value={userId}
        onChangeText={setUserId}
        keyboardType="numeric"
        style={{ borderWidth: 1, marginVertical: 5, padding: 10 }}
      />
      <Button
        title={createPostMutation.isLoading ? "Creating..." : "Create Post"}
        onPress={handleCreatePost}
        disabled={createPostMutation.isLoading} // Disable button during mutation
      />
      <Button
        title="Filter by User ID"
        onPress={() => {
          setFilterUserId(userId); // Update filterUserId
        }}
      />

      {/* Posts List */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              marginVertical: 10,
              padding: 10,
              borderWidth: 1,
              borderRadius: 5,
              backgroundColor: "#f9f9f9",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
            <Text>{item.body}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
