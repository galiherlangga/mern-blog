import React from "react";
import { useParams } from "react-router";
import articles from "../content";

// Components
import Articles from "../components/Articles";
import NotFound from "./NotFound";

const Article = () => {
  const { slug } = useParams();
  const article = articles.find((article) => article.slug === slug);
  if (!article) return <NotFound/>;

  const otherArticles = articles.filter((article) => article.slug !== slug);
  return (
    <>
      <div className="mb-20">
        <h1 className="sm:text-4xl text-2xl font-bold my-6 text-gray-600">
          {article.title}
        </h1>
        <p className="mx-auto leading-relaxed text-base mb-4">{article.body}</p>
      </div>
      <div className="sm:text-2xl text-xl font-bold my-4 text-slate-500">
        Other Articles
      </div>
      <div className="flex flex-wrap -m-4">
        <Articles articles={otherArticles} />
      </div>
    </>
  );
};

export default Article;
