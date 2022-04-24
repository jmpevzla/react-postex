import { TPost } from "@/types/posts-types";
import axios from "axios";

export function preparePhoto(post: TPost): TPost {
  return {
    ...post,
    photo: post.photo ? axios.defaults.baseURL + '/' + post.photo : ''
  }
}