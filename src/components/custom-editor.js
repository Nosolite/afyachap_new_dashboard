import React, { useEffect } from 'react'
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css'; // Import Quill styles

function CustomEditor({ value, onChange, placeholder = "Start writing...", height = 300 }) {
    const { quill, quillRef } = useQuill({
        modules: {
            toolbar: [
                [{ 'font': [] }],
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                [{ 'size': ['small', false, 'large', 'huge'] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'script': 'sub' }, { 'script': 'super' }],
                ['blockquote', 'code-block'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'indent': '-1' }, { 'indent': '+1' }],
                [{ 'align': [] }],
                ['link', 'image', 'video'],
                ['clean']
            ]
        },
        formats: [
            'font', 'header', 'size',
            'bold', 'italic', 'underline', 'strike',
            'color', 'background',
            'script', 'blockquote', 'code-block',
            'list', 'indent', 'align',
            'link', 'image', 'video'
        ],
        placeholder,
    });

    // When editor is ready, listen for changes
    useEffect(() => {
        if (quill) {
            quill.on('text-change', () => {
                const html = quill.root.innerHTML;
                onChange(html);
            });

            // Set initial value if any
            if (value && quill.root.innerHTML !== value) {
                quill.root.innerHTML = value;
            }
        }
    }, [quill, value, onChange]);

    return (
        <div style={{ height }}>
            <div ref={quillRef} style={{ height: '100%' }} />
        </div>
    )
}

export default CustomEditor