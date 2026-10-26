import { useEffect, useRef, useState } from "react";

export default function TypingName({
    name = "",
    speed = 100,
    blinkSpeed = 300,
}) {
    const [displayedName, setDisplayedName] = useState("");
    const [showCursor, setShowCursor] = useState(true);
    const [cursorDone, setCursorDone] = useState(false);

    const typingIntervalRef = useRef(null);
    const blinkIntervalRef = useRef(null);

    useEffect(() => {
        clearInterval(typingIntervalRef.current);
        clearInterval(blinkIntervalRef.current);

        if (!name) {
            setDisplayedName("");
            return;
        }

        let currentIndex = 0;

        setDisplayedName("");
        setShowCursor(true);
        setCursorDone(false);

        typingIntervalRef.current = setInterval(() => {
            currentIndex += 1;

            setDisplayedName(name.slice(0, currentIndex));

            if (currentIndex >= name.length) {
                clearInterval(typingIntervalRef.current);

                // Kedip 2 kali (4x toggle nyala-mati), lalu kursor hilang permanen
                let blinkCount = 0;
                const maxBlinks = 4;

                blinkIntervalRef.current = setInterval(() => {
                    setShowCursor((prev) => !prev);
                    blinkCount += 1;

                    if (blinkCount >= maxBlinks) {
                        clearInterval(blinkIntervalRef.current);
                        setShowCursor(false);
                        setCursorDone(true);
                    }
                }, blinkSpeed);
            }
        }, speed);

        return () => {
            clearInterval(typingIntervalRef.current);
            clearInterval(blinkIntervalRef.current);
        };
    }, [name, speed, blinkSpeed]);

    return (
        <span className="inline-flex items-center">
            {displayedName}

            {!cursorDone && (
                <span
                    aria-hidden="true"
                    className="ml-0.5 inline-block h-5 w-0.5 bg-accent transition-opacity duration-150 md:h-6"
                    style={{ opacity: showCursor ? 1 : 0 }}
                />
            )}
        </span>
    );
}