import Giscus from '@giscus/react';

export const GiscusComments = () => {
  return (
    <div className="mt-32 pt-16 border-t border-text-main/5">
      <Giscus
        id="comments"
        repo="EHOzg/whisper"
        repoId="R_kgDOR871uw"
        category="Announcements"
        categoryId="DIC_kwDOR871u84C6cbG"
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme="preferred_color_scheme"
        lang="zh-CN"
        loading="lazy"
      />
    </div>
  );
};
