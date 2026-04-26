import Foundation
import Vision
import AppKit

let path = "/Users/rishabhyash/Desktop/city-roll-full/.tmp/menu_extract/menu.png"
let url = URL(fileURLWithPath: path)
let image = NSImage(contentsOf: url)!
var rect = NSRect(origin: .zero, size: image.size)
let cgImage = image.cgImage(forProposedRect: &rect, context: nil, hints: nil)!

let request = VNRecognizeTextRequest()
request.recognitionLevel = .accurate
request.usesLanguageCorrection = false
request.minimumTextHeight = 0.003

let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
try handler.perform([request])
let observations = request.results as? [VNRecognizedTextObservation] ?? []
let lines = observations.compactMap { obs -> (Double, Double, String)? in
    guard let candidate = obs.topCandidates(1).first else { return nil }
    let box = obs.boundingBox
    return (Double(box.minY), Double(box.minX), candidate.string)
}.sorted { a, b in
    if abs(a.0 - b.0) > 0.01 { return a.0 > b.0 }
    return a.1 < b.1
}
for (_, _, text) in lines {
    print(text)
}
