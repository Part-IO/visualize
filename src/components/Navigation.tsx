import gsap from "gsap";
import Slider from "material-ui-slider";

export function Nav({ currSlide, setCurrSlide, cameraRef, allSlidesRef, zRef }) {
    if (!currSlide) return null;

    function handleSlider(_, value) {
        const slide = allSlidesRef.current[value];

        gsap.to(cameraRef.current.position, {
            z: slide.position.z + 0.55,
            duration: 0.5,
        });
        zRef.current = slide.position.z + 0.6;
        setCurrSlide(slide);
    }

    const marks = allSlidesRef.current.map((slide) => ({
        value: slide.userData.i,
        label:
            slide.userData.i === 0 || slide.userData.i === allSlidesRef.current.length - 1
                ? slide.userData.data.label
                : undefined,
    }));

    return (
        <div className="timeline-nav">
            <Slider
                defaultValue={0}
                onChange={handleSlider}
                marks={marks}
                valueLabelDisplay="auto"
                valueLabelFormat={(val) => allSlidesRef.current[val]?.userData.data.label}
                min={0}
                max={allSlidesRef.current.length - 1}
            />
        </div>
    );
}
