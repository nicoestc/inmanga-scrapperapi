import { opine } from "https://deno.land/x/opine@2.2.0/mod.ts";
import { opineCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { ChapterPage } from "./helpers/types.ts";
import { mangaService } from "./core/service.ts";
import { mangaParser } from "./core/parser.ts";

const app = opine();
app.use(opineCors());


app.get('/manga/search', async (req, res) => {
    const mangaName: string = req.query.name;
    const htmlMangaResults: string = await mangaService.fetchMangaResults(mangaName);
    return res.json({ results: mangaParser.parseMangaResults(htmlMangaResults) });
});


app.get('/manga/chapter/get-all', async (req, res) => {
    res.json({ results: await mangaService.fetchAllChaptersInfo(req.query.id) });
});


app.get('/manga/chapter/get/:name/:chapterNumber/:chapterId', async (req, res) => {
    const { chapterId, name, chapterNumber }  = req.params;
    const htmlChaptersResults: string = await mangaService.fetchAllChapterPages(chapterId, name, chapterNumber);
    const parsedChaptersResults: ChapterPage[] = mangaParser.parseChapterPages(htmlChaptersResults, name, chapterNumber);
    res.json({ results: parsedChaptersResults });
});

app.use((_req, res) => res.json({ msg: '¿Que haces aqui papacs?' }));

app.listen(
    3000,
    () => console.log("server has started on http://localhost:3000 💀"),
);
