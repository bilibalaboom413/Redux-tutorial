// // Import the RTK Query methods from the React-specific entry point
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define our single API slice object
export const apiSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: 'api',
  // All requests start with '/fakeApi'
  baseQuery: fetchBaseQuery({ baseUrl: '/fakeApi' }),
  // automatic data refetching
  tagTypes: ['Posts'], // declaring an array of string tag names for data types such as 'Post'
  // The 'endpoints'represent operations and requests for this server
  endpoints: (builder) => ({
    // The `getPosts` endpoint is a "query" operation that returns data
    // builder.mutation() send an update to server
    getPosts: builder.query({
      // URL is '/fakeApi/posts
      // By default, query endpoints will use a GET HTTP request,
      // but you can override that by returning an object like
      // {url: '/posts', method: 'POST', body: newPost}
      // instead of just the URL string itself.
      query: () => '/posts',
      providesTags: ['Posts'], // listing a set of tags describing the data in that query
    }),
    getPost: builder.query({
      query: (postId) => `/posts/${postId}`,
    }),
    addNewPost: builder.mutation({
      query: (initialPost) => ({
        url: '/posts',
        method: 'POST',
        body: initialPost,
      }),
      invalidatesTags: ['Posts'], //  listing a set of tags that are invalidated every time that mutation runs
    }),
  }),
})

// Export the auto-generated hook for the 'getPosts' query endpoint
export const { useGetPostsQuery, useGetPostQuery, useAddNewPostMutation } =
  apiSlice
