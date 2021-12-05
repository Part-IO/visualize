export type ScrollerObserver = (district: string) => void;

class Scroller {
    private observers: ScrollerObserver[] = [];

    public attach(observer: ScrollerObserver) {
        this.observers.push(observer);
    }

    public detach(observerToRemove: ScrollerObserver) {
        this.observers = this.observers.filter((observer) => observerToRemove !== observer);
    }

    public onScrollStateChange(district: string) {
        this.notify(district);
    }

    private notify(district: string) {
        this.observers.forEach((observer) => observer(district));
    }
}

const scroller = new Scroller();
export default scroller;
