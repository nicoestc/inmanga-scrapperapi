type ChapterInfo = {
    PagesCount: number;
    Watched: boolean;
    MangaIdentification: string;
    MangaName: string;
    FriendlyMangaName: string;
    Id: number;
    MangaId: number;
    Number: number;
    RegistrationDate: string;
    Description: string;
    Pages: Array<any>;
    Identification: string;
    FeaturedChapter: boolean;
    FriendlyChapterNumber: string;
    FriendlyChapterNumberUrl: string;
}

type ChapterPage = {
    PageId: string;
    PageNum: string;
    ChapterURL: string;
}

type MangaResult = {
    MangaId: string | undefined;
    MangaName: string | undefined;
    ThumbnailSrc: string | null;
}

export type { ChapterInfo, ChapterPage, MangaResult }