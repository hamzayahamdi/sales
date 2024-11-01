import {useState, useRef} from 'react';

const useTags = () => {
    const [tags, setTags] = useState([]);
    const inputRef = useRef(null);

    const handleAddTag = e => {
        if (e.key === 'Enter') {
            const newTag = inputRef.current.value.trim();
            if (newTag === '') return;
            if (tags.includes(newTag.toLowerCase())) return;
            setTags([...tags, newTag]);
            inputRef.current.value = '';
        }
    }

    const handleDeleteTag = tag => {
        setTags(tags.filter(t => t !== tag));
    }

    return {tags, inputRef, handleAddTag, handleDeleteTag};
}

export default useTags