import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-dropzone',
  templateUrl: './dropzone.component.html',
  styleUrls: ['./dropzone.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DropzoneComponent {
  @Input() hint = '';
  @Input() buttonLabel = '';
  @Input() accept = '';
  @Input() multiple = true;
  @Input() disabled = false;

  @Output() filesSelected = new EventEmitter<File[]>();

  dragging = false;

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragging = !this.disabled;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging = false;
    this.emit(event.dataTransfer?.files ?? null);
  }

  onChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.emit(input.files);
    input.value = '';
  }

  private emit(files: FileList | null): void {
    if (this.disabled || !files || files.length === 0) {
      return;
    }
    this.filesSelected.emit(Array.from(files));
  }
}
