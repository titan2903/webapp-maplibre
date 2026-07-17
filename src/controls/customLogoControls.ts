import { type IControl, Map } from "maplibre-gl";
import logoMitsubishi from "../logo/mitsubishi-heavy-industries-seeklogo.png";

export class logoMitsubishiControl implements IControl {
    private _container?: HTMLDivElement;

    onAdd(_map: Map): HTMLElement {
        this._container = document.createElement('div');
        this._container.className = 'maplibregl-ctrl';
        this._container.innerHTML = `
            <img
                src="${logoMitsubishi}"
                alt="Logo Mitsubishi"
                style="width: 200px"
            >
        `;
        return this._container;
    }

    onRemove(): void {
        if (this._container && this._container.parentNode) {
            this._container.parentNode.removeChild(this._container);
        }
    }
}
