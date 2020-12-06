import Layout from "../../components/Layout";
import Head from "next/head";
import { GetStaticPaths, GetStaticProps } from "next";
import { getArticleIds, getArticle } from "../../lib/articles";
import { ParsedUrlQuery } from "querystring";

interface DetailProps {
  date: string | null;
  title: string;
  content: string;
  ogp: {
    title: string;
    description: string;
    image?: string;
  } | null;
}

export default function Detail({
  title,
  content,
  date,
  ogp,
}: DetailProps): JSX.Element {
  return (
    <Layout>
      <Head>
        <title>{title}</title>
        {ogp && (
          <>
            <meta property="og:title" content={ogp.title} />
            <meta property="og:description" content={ogp.description} />
            {ogp.image != null && (
              <meta property="og:image" content={ogp.image} />
            )}
            {ogp.image != null ? (
              <meta name="twitter:card" content="summary_large_image" />
            ) : (
              <meta name="twitter:card" content="summary" />
            )}
          </>
        )}
      </Head>
      <article>
        <div>
          {date && <span>{date}</span>}
          <h1>{title}</h1>
        </div>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </article>
    </Layout>
  );
}

interface Query extends ParsedUrlQuery {
  id: string;
}

export const getStaticPaths: GetStaticPaths<Query> = async () => {
  const ids = getArticleIds();
  return {
    paths: ids.map((id) => ({
      params: {
        id,
      },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<DetailProps, Query> = async ({
  params,
}) => {
  const article = await getArticle((params as Query).id);
  return {
    props: {
      date: article.date,
      title: article.title,
      content: article.content,
      ogp: article.ogp,
    },
  };
};
