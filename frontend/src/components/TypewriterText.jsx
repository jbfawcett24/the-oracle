import { useEffect, useState } from "react"

export default function TypewriterText({ text, speed = 20 }) {
    const [visibleCharacters, setVisibleCharacters] = useState(0)

    useEffect(() => {
        let characterCount = 0

        function typeNextCharacter() {
            characterCount += 1
            setVisibleCharacters(characterCount)

            if (characterCount < text.length) {
                timeoutId = setTimeout(typeNextCharacter, speed)
            }
        }

        let timeoutId = setTimeout(typeNextCharacter, speed)

        return () => clearTimeout(timeoutId)
    }, [text, speed])

    return <>{text.slice(0, visibleCharacters)}</>
}
