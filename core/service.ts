import { ChapterInfo, ChapterPage } from "../helpers/types.ts";

type MangaService = {
    _url: string;
    _getURLSearchParams(name: string): URLSearchParams;
    fetchMangaResults(name: string): Promise<string>;
    fetchAllChaptersInfo(mangaId: string): Promise<ChapterInfo[]>;
    fetchAllChapterPages(chapterId: string, name: string, chapterNumber: string): Promise<string>
}


const mangaService: MangaService = {

    _url: 'https://inmanga.com',

    _getURLSearchParams(name: string): URLSearchParams {
        //take es igual a la cantidad de resultados que va a devolver
       return new URLSearchParams(`filter%5Bgeneres%5D%5B%5D=-1&filter%5BqueryString%5D=${name}&filter%5Bskip%5D=0&filter%5Btake%5D=10&filter%5Bsortby%5D=1&filter%5BbroadcastStatus%5D=0&filter%5BonlyFavorites%5D=false&d=`);
    },

    async fetchMangaResults(name: string): Promise<string> {
        const searchParams: URLSearchParams = this._getURLSearchParams(name);
        const response: Response = await fetch(`${this._url}/manga/getMangasConsultResult`, {
            method: 'POST',
            body: searchParams,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    
        // esto me devuelve un html con todos los mangas segun mi busqueda
        // por nombre y cada entrada cuante con su id
        return response.text();
    },

    async fetchAllChaptersInfo(mangaId: string): Promise<ChapterInfo[]> {
        const response = await fetch(`${this._url}/chapter/getall?mangaIdentification=${mangaId}`);
        const capList: ChapterInfo[] = JSON.parse((await response.json()).data).result;
        return capList;
    },

    async fetchAllChapterPages(chapterId: string, name: string, chapterNumber: string): Promise<string> {
        const response: Response = await fetch(`${this._url}/chapter/chapterIndexControls?identification=${chapterId}`);
        return response.text();
    }
}

export { mangaService }