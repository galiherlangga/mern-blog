import React from "react";
import { useParams } from "react-router";
import articles from "../content";

const Article = () => {
  const { slug } = useParams();
  const article = articles.find((article) => article.slug === slug);
  if (!article) return <h1>Article does not exist!</h1>;
  return (
    <div className="mb-20">
      <h1 className="sm:text-4xl text-2xl font-bold my-6 text-gray-600">
        {article.title}
      </h1>
      <p className="mx-auto leading-relaxed text-base mb-4">
        {article.body} 
      </p>
    </div>
  );
};

export default Article;
