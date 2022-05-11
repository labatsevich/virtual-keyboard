const createControl = (tag, text, classes = []) => {
    const control = document.createElement(tag);
    control.classList.add(...classes);
    control.innerText = text;

    return control;
};

export default createControl;