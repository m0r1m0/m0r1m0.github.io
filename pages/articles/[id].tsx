import Layout from "../../components/Layout";
import Head from "next/head";
import { GetStaticPaths, GetStaticProps } from "next";
import { getArticleIds, getArticle } from "../../lib/articles";
import { ParsedUrlQuery } from "querystring";

interface DetailProps {
  title: string;
  content: string;
}

export default function Detail({ title, content }: DetailProps): JSX.Element {
  return (
    <Layout>
      <Head>
        <title>{title}</title>
      </Head>
      <article>
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
  const article = await getArticle(params.id);
  return {
    props: {
      title: article.title,
      content: article.content,
    },
  };
};
