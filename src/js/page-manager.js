import Events from "./events";

class PageManager extends Events {
    constructor(props) {
        super(props);

        this.currentPage = null;
    }

    open(page) {
        this.currentPage = page
        this.emit('open', { page: page })
    }

    getCurrentPage() {
        return this.currentPage;
    }

    setCurrentPage(page) {
       this.currentPage = page;
    }
}

export default new PageManager()