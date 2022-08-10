import { DOMParser, Element, HTMLDocument } from "https://deno.land/x/deno_dom@v0.1.33-alpha/deno-dom-wasm.ts";
import { ChapterPage, MangaResult } from "../helpers/types.ts";

type MangaParser = {
    _url: string;
    _domParser: DOMParser;
    parseMangaResults(html: string): MangaResult[];
    parseChapterPages(html: string, mangaName: string, chapterNumber: string): ChapterPage[];
}


const mangaParser: MangaParser = {

    _url: 'https://inmanga.com',

    _domParser: new DOMParser(),

    parseMangaResults(html: string): MangaResult[] {
        const document: HTMLDocument = this._domParser.parseFromString(html, 'text/html')!;
        const mangaResultsNodeList: Element[] = document?.getElementsByClassName('manga-result');
        const parsedMangaResults: MangaResult[]  = mangaResultsNodeList!.map<MangaResult>(result => ({
            MangaId: result.getAttribute('href')?.split('/').splice(-1)[0],
            MangaName: result.getElementsByClassName('ellipsed-text')[0]?.textContent.trim(),
            ThumbnailSrc: `${this._url}${result.getElementsByTagName('img')[0]?.getAttribute('data-src')}`
        }));
        return parsedMangaResults;
    },

    parseChapterPages(html: string, mangaName: string, chapterNumber: string): ChapterPage[] {
        const document: HTMLDocument = this._domParser.parseFromString(html, 'text/html')!;
        const pageList: Element = document.querySelector('#PageList')!;
        const options: Element[] = pageList.getElementsByTagName('option');
        const chapterPages: ChapterPage[] = options.map<ChapterPage>((opt) => ({
            PageId: opt.getAttribute('value')!,
            PageNum: opt.textContent,
            ChapterURL: `https://pack-yak.intomanga.com/images/manga/${mangaName}/chapter/${chapterNumber}/page/${opt.textContent}/${opt.getAttribute('value')}`
        }));
        return chapterPages;
    }
}
export { mangaParser }