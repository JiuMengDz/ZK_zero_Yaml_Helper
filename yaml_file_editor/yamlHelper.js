const body_container = document.querySelector("body");

function init_page() {
    // @ts-ignore
    const vscode = acquireVsCodeApi();

    window.addEventListener("message", event => {
        let data = event.data;
        switch (data.command) {
            case "update":
                body_container.innerHTML = "";
                let yaml_obj = data.yaml_content;
                for (var name in yaml_obj) {
                    body_container.appendChild(createDocument(name, yaml_obj[name]));
                }
                break;
            default:
        }
    })

    document.querySelector(".add_button").addEventListener("click", () => {
        vscode.postMessage({
            command: "delete"
        })
        // let item = document.querySelector("body");
        // item.appendChild(createDocument("new"));
    })
}

function get_inner_html(yaml_obj, space = 0) {
    let div = document.createElement("div")
    var space = space + 10;
    for (var key in yaml_obj) {
        let obj = yaml_obj[key];
        let p = document.createElement("p");
        p.innerText = key;
        p.style.marginLeft = space + "px";

        if (typeof (obj) == "object") {
            p.appendChild(get_inner_html(obj, space));
        } else {
            let input_text = document.createElement("input");
            input_text.value = obj;
            p.appendChild(input_text);
        }
        div.appendChild(p);
    }
    return div;
}

function createDocument(name, yaml_obj) {
    let item_div = document.createElement("div");
    item_div.id = "item";

    let input_text = document.createElement("input");
    input_text.value = name;
    item_div.appendChild(input_text);

    let item_div2 = document.createElement("div");
    for (var pro_name in yaml_obj) {
        let obj = yaml_obj[pro_name]
        let p = document.createElement("p");
        p.innerText = pro_name;

        if (typeof (obj) == "string") {
            let input_text = document.createElement("input");
            input_text.value = obj;
            p.appendChild(input_text);
        } else {
            p.appendChild(get_inner_html(obj));
        }

        item_div2.appendChild(p);
    }
    item_div.appendChild(item_div2);
    return item_div;
}

init_page();