"use client";

export default function SizeSelector({ sizes, selectedSize, onSizeChange }) {
  if (!sizes || sizes.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">Size</h3>
        <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-500">
          Size guide
        </a>
      </div>

      <fieldset className="mt-4">
        <legend className="sr-only">Choose a size</legend>
        <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
          {sizes.map((sizeOption) => (
            <label
              key={sizeOption.size}
              className={`group relative border rounded-md py-3 px-4 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6 cursor-pointer ${
                sizeOption.inStock
                  ? selectedSize === sizeOption.size
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-900 border-gray-200"
                  : "bg-gray-50 text-gray-200 border-gray-200 cursor-not-allowed"
              }`}
            >
              <input
                type="radio"
                name="size-choice"
                value={sizeOption.size}
                disabled={!sizeOption.inStock}
                className="sr-only"
                aria-labelledby={`size-choice-${sizeOption.size}-label`}
                onChange={() => onSizeChange(sizeOption.size)}
                checked={selectedSize === sizeOption.size}
              />
              <span id={`size-choice-${sizeOption.size}-label`}>
                {sizeOption.size}
              </span>
              {!sizeOption.inStock && (
                <span
                  className="absolute -inset-px rounded-md border-2 border-gray-200 pointer-events-none"
                  aria-hidden="true"
                >
                  <svg
                    className="absolute inset-0 w-full h-full text-gray-200 stroke-2"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    stroke="currentColor"
                  >
                    <line x1="0" y1="100" x2="100" y2="0" vectorEffect="non-scaling-stroke" />
                  </svg>
                </span>
              )}
            </label>
          ))}
        </div>
      </fieldset>

      {selectedSize && (
        <div className="mt-4 text-sm text-gray-600">
          Selected size: <span className="font-medium">{selectedSize}</span>
        </div>
      )}
    </div>
  );
}