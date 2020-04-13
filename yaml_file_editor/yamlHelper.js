const body_container = document.querySelector("body");
// @ts-ignore
const vscode = acquireVsCodeApi();

function init_page() {
    window.addEventListener("message", event => {
        let data = event.data;
        switch (data.command) {
            case "update":
                let yaml_obj = data.yaml_content;
                _updateContent(yaml_obj);
                vscode.setState({yaml_obj});
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

function _updateContent(yaml_obj){
    body_container.innerHTML = "";
    for (var name in yaml_obj) {
        body_container.appendChild(createDocument(name, yaml_obj[name]));
    }
}

function get_inner_html(yaml_obj, space = 0, is_sheet = false) {
    let div = document.createElement("div")
    var space = space + 20;
    div.style.marginLeft = space + 'px';
    for (var key in yaml_obj) {
        let obj = yaml_obj[key];

        if(is_sheet){
            let button = _createButton(key, (content)=>{
                vscode.postMessage({
                    command: 'open_file',
                    file_name: content
                });
            });
            div.appendChild(button);
        }else{
            div.appendChild(_createSpan(key));
        }
        
        if (typeof (obj) == "object") {
            if(is_sheet){
                let span = _createSpan(obj.toString(), "value");
                div.appendChild(span);
            }
            else{
                div.appendChild(get_inner_html(obj, space, is_sheet));
            }
        } else {
            div.appendChild(_createSpan(obj, "value"));
        }
    }
    return div;
}

function createDocument(name, yaml_obj) {

    let item_div = document.createElement("div");
    item_div.id = "item";

    let input_text = document.createElement("h2");
    input_text.innerText = name;
    item_div.appendChild(input_text);

    let item_div2 = document.createElement("div");
    for (var pro_name in yaml_obj) {
        let obj = yaml_obj[pro_name]
        let p = document.createElement("p");
        p.innerText = pro_name;
        
        if (typeof (obj) == "string") {
            let input_text = document.createElement("span");
            input_text.innerText = obj;
            input_text.id = "value";
            p.appendChild(input_text);
        } else {
            p.appendChild(get_inner_html(obj, 0, pro_name == ".sheets"));
        }

        item_div2.appendChild(p);
    }
    item_div.appendChild(item_div2);
    return item_div;
}


function _createButton(content, cb){
    let button = document.createElement("button");
    button.innerText = content;

    if(cb){
        console.log(content);
        button.addEventListener('click', ()=>{
            cb(content);
        });
    }

    return button;
}

function _createSpan(content, id = null){
    let span = document.createElement("span");
    span.id = id;
    span.innerText = content;
    return span;
}

init_page();

const state = vscode.getState();
if (state) {
    _updateContent(state.yaml_obj);
}