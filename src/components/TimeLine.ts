document.querySelector(".progress").each((_, progress) => {
    const steps = document.querySelector("> div.right > div", progress);

    steps.each((i, el) => document.querySelector(el).mouseenter((e) => onHover(el)));

    const onHover = (el) => {
        steps.removeClass(["current", "prev"]);
        el.classList.add("current");
        document.querySelector(el).prevAll().slice(1).classList.add("prev");
    };
});

export default {};
