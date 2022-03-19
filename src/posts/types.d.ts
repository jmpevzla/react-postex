interface TPost {
  id: number,
  title: string,
  author: string
}

type TPosts = TPost[]

declare module "theme-change";