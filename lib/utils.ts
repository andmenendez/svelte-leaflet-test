import type { LatLngExpression } from "leaflet";

export function convertSvgCoordinates(svgPathData: string): LatLngExpression[] {
    const coordinates: [number, number][] = [];
    const parts = svgPathData.split(/[, ]+/); // Split by commas and spaces

    let currentX = 0;
    let currentY = 0;

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];

        if (part === "M" || part === "L") {
            // Move to or Line to commands
            currentX = parseFloat(parts[++i]);
            currentY = parseFloat(parts[++i]);
            coordinates.push([currentX, currentY]);
        } else if (part === "Z") {
            // Close path command, no coordinates needed
            //No coordinates are added here.
        } else if (!isNaN(parseFloat(part))) {
            //if the part is a number and no command was found, it must be part of a lineTo command that was implicit.
            currentX = parseFloat(part);
            currentY = parseFloat(parts[++i]);
            if (!isNaN(currentX) && !isNaN(currentY)) {
                coordinates.push([currentX, currentY]);
            }
        }
    }

    return mirrorCoordinateVertically(coordinates.slice(0,coordinates.length-5));
}


export function mirrorCoordinateVertically(coordinates: [number, number][]): LatLngExpression[] {
    let maxY = 1304;
    return coordinates.map(([y, x]) => {
        const flippedY = maxY - y;
        return [flippedY, x];
    });
}
