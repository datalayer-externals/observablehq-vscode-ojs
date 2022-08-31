import { Runtime, Library } from "@observablehq/runtime";
import { FileAttachments } from "@observablehq/stdlib";
import { Cell } from "./cell";
import { observablehq as ohq } from "./types";

export class Notebook {

    protected _runtime: ohq.Runtime;
    protected _main: ohq.Module;

    constructor(notebook?: ohq.Notebook, plugins: object = {}) {
        const files = {};
        notebook?.files?.forEach(f => files[f.name] = f.url);

        const library = new Library();
        library.FileAttachment = function () {
            return FileAttachments(name => {
                return files[name];
            });
        };

        const domDownload = library.DOM.download;
        library.DOM.download = function (blob, file) {
            return domDownload(blob, files[file]);
        };

        this._runtime = new Runtime({ ...library, ...plugins });
        this._main = this._runtime.module();
    }

    dispose() {
        this._runtime.dispose();
        delete this._runtime;
        delete this._main;
    }

    createCell(inspector: ohq.InspectorFactory): Cell {
        return new Cell(this, inspector);
    }

    //  ObservableHQ  ---
    main(): ohq.Module {
        return this._main;
    }

    createModule(define): ohq.Module {
        return this._runtime.module(define);
    }

    createVariable(inspector?: ohq.Inspector): ohq.Variable {
        return this._main.variable(inspector);
    }

    importVariable(name: string, alias: string, otherModule: ohq.Module): ohq.Variable {
        return this._main.import(name, alias, otherModule);
    }

    removeCell(id: string) {
    }
}