import { DOMParser, Element, HTMLDocument } from "https://deno.land/x/deno_dom@v0.1.33-alpha/deno-dom-wasm.ts";
import { opine } from "https://deno.land/x/opine@2.2.0/mod.ts";
import { opineCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";


type ChapterInfo = {
    PagesCount: number,
    Watched: boolean,
    MangaIdentification: string,
    MangaName: string,
    FriendlyMangaName: string,
    Id: number,
    MangaId: number,
    Number: number,
    RegistrationDate: string,
    Description: string,
    Pages: Array<any>,
    Identification: string,
    FeaturedChapter: boolean,
    FriendlyChapterNumber: string,
    FriendlyChapterNumberUrl: string
};

type ChapterPage = {
    PageId: string,
    PageNum: string,
    ChapterURL: string
};


type MangaResult = {
    MangaId: string | undefined,
    MangaName: string | undefined,
    ThumbnailSrc: string | null
};


function getURLSearchParams(mangaName: string): URLSearchParams {
   return new URLSearchParams(`filter%5Bgeneres%5D%5B%5D=-1&filter%5BqueryString%5D=${mangaName}&filter%5Bskip%5D=0&filter%5Btake%5D=10&filter%5Bsortby%5D=1&filter%5BbroadcastStatus%5D=0&filter%5BonlyFavorites%5D=false&d=`);
}

const app = opine();
app.use(opineCors());


app.get('/manga/search', async (req, res) => {

    const mangaName: string = req.query.name;
    const searchParams: URLSearchParams = getURLSearchParams(mangaName);
    const response: Response = await fetch('https://inmanga.com/manga/getMangasConsultResult', {
        method: 'POST',
        body: searchParams,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    
    //esto me devuelve un html con todos los mangas segun mi busqueda por nombre y cada entrada cuante con su id
    const resultsHTML: string = await response.text();
    const document: HTMLDocument = new DOMParser().parseFromString(resultsHTML, 'text/html')!;
    const mangaResultsNodeList: Element[] = document?.getElementsByClassName('manga-result');

    
    const parsedMangaResults: MangaResult[]  = mangaResultsNodeList!.map<MangaResult>(result => ({
        MangaId: result.getAttribute('href')?.split('/').splice(-1)[0],
        MangaName: result.getElementsByClassName('ellipsed-text')[0]?.textContent.trim(),
        ThumbnailSrc: result.getElementsByTagName('img')[0]?.getAttribute('data-src')
    }));

    res.json({ results: parsedMangaResults });
});


app.get('/manga/chapter/get-all', async (req, res) => {
    const mangaId: string = req.query.id;
    const response: Response = await fetch(`https://inmanga.com/chapter/getall?mangaIdentification=${mangaId}`);
    const capList: ChapterInfo[] = JSON.parse((await response.json()).data).result;
    res.json({ results: capList });
});


app.get('/manga/chapter/get/:name/:chapterNumber/:chapterId', async (req, res) => {
    const chapterId: string = req.params.chapterId;
    const mangaName: string = req.params.name;
    const chapterNumber: string = req.params.chapterNumber
    const response: Response = await fetch(`https://inmanga.com/chapter/chapterIndexControls?identification=${chapterId}`);
    const data: string = await response.text();
    const document: HTMLDocument = new DOMParser().parseFromString(data, 'text/html')!;
    const pageList: Element = document.querySelector('#PageList')!;
    const options: Element[] = pageList.getElementsByTagName('option');
    const chapterPages: ChapterPage[] = options.map<ChapterPage>((opt) => ({
        PageId: opt.getAttribute('value')!,
        PageNum: opt.textContent,
        ChapterURL: `https://pack-yak.intomanga.com/images/manga/${mangaName}/chapter/${chapterNumber}/page/${opt.textContent}/${opt.getAttribute('value')}`
    }));


    /*

        el chapter url puede devolver un blob que puedo escribir como un jpg;

        const pageImg = await page.blob();

        await Deno.writeFile('pagina_berserk.jpg', new Uint8Array(await pageImg.arrayBuffer()));
        
    */

    res.json({ results: chapterPages });
});


app.listen(
    3000,
    () => console.log("server has started on http://localhost:3000 💀"),
);
