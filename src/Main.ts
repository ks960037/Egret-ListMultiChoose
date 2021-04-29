class Main extends eui.UILayer {
    protected createChildren(): void {
        super.createChildren();
        egret.lifecycle.onPause = () => egret.ticker.pause();
        egret.lifecycle.onResume = () => egret.ticker.resume();
        egret.registerImplementation('eui.IAssetAdapter', new AssetAdapter());
        egret.registerImplementation('eui.IThemeAdapter', new ThemeAdapter());
        this.runGame();
    }
    private async loadResource() {
        let loadingView = this.stage.addChild(new LoadingUI()) as LoadingUI;
        await RES.loadConfig('resource/default.res.json', 'resource/');
        await new Promise(resolve => new eui.Theme('resource/default.thm.json', this.stage).once(eui.UIEvent.COMPLETE, resolve, this));
        await RES.loadGroup('preload', 0, loadingView);
        this.stage.removeChild(loadingView);
    }
    private async runGame() {
        await this.loadResource();

        let mainView = new MainView();
        this.addChild(mainView);
    }
}

class MainView extends eui.Component {

    private scr_demo: eui.Scroller;
    private lst_demo: eui.List;
    private arc_demo: eui.ArrayCollection;

    private btn_showRare: eui.Button;
    private btn_showUnrare: eui.Button;
    private btn_showAll: eui.Button;
    private btn_selecteAll: eui.Button;
    private btn_selecteBad: eui.Button;
    private btn_cancelSelected: eui.Button;

    constructor() {
        super();
        this.skinName = "resource/MainView.exml";
        this.percentWidth = 100;
        this.percentHeight = 100;
    }

    private demoData: ItemData[] = [
        { itemId: 0, itemName: "軒轅劍", quality: 95, rare: "S", color: "0xFF50FF", type: "weapon", },
        { itemId: 1, itemName: "鐵劍", quality: 5, rare: "E", color: "0x0050CC", type: "weapon", },
        { itemId: 2, itemName: "木劍", quality: 3, rare: "E", color: "0x0050CC", type: "weapon", },
        { itemId: 3, itemName: "無極戰甲", quality: 85, rare: "S", color: "0xFF50FF", type: "arms", },
        { itemId: 4, itemName: "鐵甲", quality: 5, rare: "E", color: "0x0050CC", type: "arms", },
        { itemId: 5, itemName: "布甲", quality: 3, rare: "E", color: "0x0050CC", type: "arms", },
        { itemId: 6, itemName: "金創藥", quality: 5, rare: "A", color: "0xAAAA44", type: "drug", },
        { itemId: 6, itemName: "金創藥", quality: 5, rare: "A", color: "0xAAAA44", type: "drug", },
        { itemId: 7, itemName: "草藥", quality: 1, rare: "E", color: "0x888888", type: "drug", },
        { itemId: 8, itemName: "回家卷軸", quality: 1, rare: "E", color: "0x888888", type: "drug", },
        { itemId: 8, itemName: "回家卷軸", quality: 1, rare: "E", color: "0x888888", type: "drug", },
        { itemId: 8, itemName: "回家卷軸", quality: 1, rare: "E", color: "0x888888", type: "drug", },
        { itemId: 8, itemName: "回家卷軸", quality: 1, rare: "E", color: "0x888888", type: "drug", },
        { itemId: 8, itemName: "回家卷軸", quality: 1, rare: "E", color: "0x888888", type: "drug", },
        { itemId: 8, itemName: "回家卷軸", quality: 1, rare: "E", color: "0x888888", type: "drug", },
        { itemId: 8, itemName: "回家卷軸", quality: 1, rare: "E", color: "0x888888", type: "drug", },
    ]

    protected childrenCreated() {
        super.childrenCreated();
        this.lst_demo.itemRenderer = ItemRenderer_demo;
        this.arc_demo.source = this.demoData;
        this.addEventListeners();
    }

    private addEventListeners() {
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickHandler, this);
    }

    private removeEventListeners() {
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickHandler, this);
    }

    private onClickHandler(evt: egret.TouchEvent) {
        switch (evt.target) {
            case this.btn_showRare:
                this.filterArc("S");
                break;
            case this.btn_showUnrare:
                this.filterArc("E");
                break;
            case this.btn_showAll:
                this.cancelFilter();
                break;
            case this.btn_selecteAll:
                this.selecteAll();
                break;
            case this.btn_selecteBad:
                this.selecteBad();
                break;
            case this.btn_cancelSelected:
                this.cancelSelected();
                break;
        }
    }

    private filterArc(rare: string) {
        this.cancelSelected();
        let result = this.demoData.filter((item) => { return item.rare == rare })
        this.arc_demo.source = result;
    }

    private cancelFilter() {
        this.cancelSelected();
        this.arc_demo.source = this.demoData;
    }

    private selecteAll() {
        this.cancelSelected();
        for (let i = 0; i < this.arc_demo.source.length; i++) {
            this.lst_demo.selectedIndices.push(i);
        }
    }

    private selecteBad() {
        this.cancelSelected();
        let shouldSelectedIndices = [];
        for (let i = 0; i < this.arc_demo.source.length; i++) {
            let itemData: ItemData = this.arc_demo.source[i];
            if (itemData.rare == "E")
                shouldSelectedIndices.push(i);
        }
        this.lst_demo.selectedIndices = shouldSelectedIndices;
    }

    private cancelSelected() {
        this.lst_demo.selectedIndices = [];
    }

}

interface ItemData {
    itemId: number,
    itemName: string,
    quality: number,
    rare: string,
    color: string,
    type: string
}

class ItemRenderer_demo extends eui.ItemRenderer implements eui.IItemRenderer {

    private rec_bg: eui.Rect;

    constructor() {
        super();
        this.skinName = "resource/ItemRenderer_demo.exml";
    }

    dataChanged() { }

}