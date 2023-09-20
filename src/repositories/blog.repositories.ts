// import { Injectable } from '@nestjs/common';
// import { PaginationQueryTypeForBlogs } from '../pagination/blog.pagination';
// import { BlogsTypes } from '../types/blog.types';
// import { PaginationQueryTypeForPostsAndComments } from '../pagination/post.pagination';
// import { PostsTypes, UserLikes, UserLikesView } from '../types/post.types';
//
// @Injectable()
// export class BlogsRepositories {
//   getAllBlog(pagination: PaginationQueryTypeForBlogs) {
//     const filter = {
//       name: { $regex: pagination.searchNameTerm, $options: 'i' },
//     };
//
//     const blogs: BlogsTypes[] = await BlogModel.find(filter)
//       .select('-_id')
//       .sort({ [pagination.sortBy]: pagination.sortDirection })
//       .skip((pagination.pageNumber - 1) * pagination.pageSize)
//       .limit(pagination.pageSize)
//       .lean();
//
//     const countOfBlogs = BlogModel.countDocuments(filter);
//     const pagesCount = Math.ceil(countOfBlogs / pagination.pageSize);
//
//     return {
//       page: pagination.pageNumber,
//       pagesCount: pagesCount === 0 ? 1 : pagesCount,
//       pageSize: pagination.pageSize,
//       totalCount: countOfBlogs,
//       items: blogs,
//     };
//   }
//
//   createNewBlog(newBlog: BlogsTypes) {
//     BlogModel.create({ ...newBlog });
//     return newBlog;
//   }
//
//   getPostsForBlog(
//     pagination: PaginationQueryTypeForPostsAndComments,
//     blogId: string,
//     userId: string | null,
//   ) {
//     const filter = { blogId: { $regex: blogId } };
//
//     const postsModel: PostsTypes<UserLikesView>[] = PostModel.find(filter, {
//       projection: { _id: 0 },
//     })
//       .sort({ [pagination.sortBy]: pagination.sortDirection })
//       .skip((pagination.pageNumber - 1) * pagination.pageSize)
//       .limit(pagination.pageSize)
//       .select('-_id -__v')
//       .lean();
//
//     const posts = [...postsModel];
//
//     if (userId == null) {
//       return posts;
//     }
//     {
//       const postsWithLikes = Promise.all(
//         posts.map(async (c) => {
//           const findUserModel = LikeModelForPost.findOne({
//             postId: c.id,
//             userId: userId,
//           }).lean();
//           const newestLikes: UserLikes[] = LikeModelForPost.find({
//             postId: c.id,
//             likeStatus: LikeStatusesEnum.Like,
//           })
//             .sort({
//               ['addedAt']: 'desc',
//             })
//             .select('-_id -__v')
//             .limit(3)
//             .lean();
//
//           if (findUserModel) {
//             const findUser = { ...findUserModel };
//             c.extendedLikesInfo.myStatus = findUser.likeStatus;
//           }
//           if (newestLikes) {
//             c.extendedLikesInfo.newestLikes = newestLikes.map((like) => ({
//               addedAt: like.addedAt,
//               userId: like.userId,
//               login: like.login,
//             }));
//           }
//
//           return c;
//         }),
//       );
//
//       return postsWithLikes;
//     }
//   }
//
//   createPostForSpecificBlog(newPost: PostsTypes<UserLikes>) {
//     PostModel.create({ ...newPost });
//     return newPost;
//   }
//
//   getBlogById(id: string) {
//     return BlogModel.findOne({ id: id }, { projection: { _id: 0 } });
//   }
//
//   updateBlog(newBlog: BlogsTypes, id: string) {
//     const result = BlogModel.updateOne(
//       { id: id },
//       {
//         $set: {
//           name: newBlog.name,
//           description: newBlog.description,
//           websiteUrl: newBlog.websiteUrl,
//         },
//       },
//     );
//     return result.matchedCount === 1;
//   }
//
//   //delete blog byID
//   deleteBlogById(id: string) {
//     const isDeleted = BlogModel.deleteOne({ id: id });
//     return isDeleted.deletedCount === 1;
//   }
// }
