import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, ZoomIn } from "lucide-react";

interface ProjectLogoPreviewProps {
    src: string;
    alt: string;
    projectName: string;
    className?: string;
    imageClassName?: string;
}

export const ProjectLogoPreview = ({
    src,
    alt,
    projectName,
    className = "",
    imageClassName = "",
}: ProjectLogoPreviewProps) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        const previousOverflow = document.body.style.overflow;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setIsOpen(false);
        };

        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    return (
        <>
            <button
                type="button"
                aria-label={`${projectName} logosunu büyüt`}
                title="Logoyu büyüt"
                onClick={(event) => {
                    event.stopPropagation();
                    setIsOpen(true);
                }}
                onKeyDown={(event) => event.stopPropagation()}
                className={`project-logo-trigger group/logo relative flex items-center justify-center overflow-hidden ${className}`}
            >
                <img
                    src={src}
                    alt={alt}
                    className={`h-full w-full object-contain ${imageClassName}`}
                    loading="lazy"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-white opacity-0 transition-opacity group-hover/logo:opacity-100 group-focus-visible/logo:opacity-100">
                    <ZoomIn className="h-5 w-5" />
                </span>
            </button>
            {isOpen && (
                createPortal(
                    <div
                        data-logo-preview-open="true"
                        className="logo-preview-backdrop fixed inset-0 z-[100] flex h-[100dvh] w-screen items-center justify-center overflow-hidden bg-black/35 backdrop-blur-md"
                        onClick={() => setIsOpen(false)}
                    >
                        <section
                            role="dialog"
                            aria-modal="true"
                            aria-label={`${projectName} logosu`}
                            className="logo-preview-panel relative flex h-full w-full items-center justify-center"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                aria-label="Logo önizlemesini kapat"
                                className="absolute right-5 top-5 z-10 rounded-full border border-white/20 bg-black/50 p-3 text-white backdrop-blur-sm hover:bg-black/75"
                            >
                                <X className="h-5 w-5" />
                            </button>
                            <img
                                src={src}
                                alt={alt}
                                className="h-full w-full object-contain mix-blend-screen"
                            />
                        </section>
                    </div>,
                    document.body,
                )
            )}
        </>
    );
};
