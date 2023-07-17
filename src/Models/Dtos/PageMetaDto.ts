    export class PageMetaDto {
    readonly totalItems: number;

    readonly currentPage: number;
    
    readonly totalPages: number;  

    constructor(totalItems: number,currentPage: number, totalPages: number){
        this.totalItems = totalItems;
        this.currentPage = currentPage;
        this.totalPages = totalPages;
    }
} 
