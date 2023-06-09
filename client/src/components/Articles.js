import React from "react";
import { Link } from "react-router-dom";

const Articles = ({articles}) => {
  return (
    <>
      {articles.map((article, key) => (
        <div key={key} className="p-4 md:w-1/2">
          <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
            <Link to={`/article/${article.slug}`}>
              <img
                className="lg:h-48 md:h-36 w-full object-cover object-center"
                src={article.thumbnail}
                alt={article.slug + "-img"}
              />
            </Link>
            <div className="p-6">
              <Link to={`/article/${article.slug}`}>
                <h2 className="text-lg font-medium text-slate-500 mb-3">
                  {article.title}
                </h2>
                <p className="leading-relaxed mb-3">
                  {article.body.substring(0, 100)}...
                </p>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Articles;
