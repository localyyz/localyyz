import Product from "../Product";

it("should initialize without error", () => {
  const product = new Product({});
  expect(product).toBeDefined();
});

describe("Photo Groups", () => {
  it("should group single color with images (in order)", () => {
    const variants = [
      { id: 1, imageId: 1, etc: { color: "white", size: "small" } },
      { id: 2, imageId: 1, etc: { color: "white", size: "medium" } }
    ];
    const images = [
      { id: 1, ordering: 1 },
      { id: 2, ordering: 2 },
      { id: 2, ordering: 3 }
    ];

    const product = new Product({
      colors: ["white"],
      variants: variants,
      images: images
    });
    expect(product).toBeDefined();

    expect(product.photoGroups).toMatchObject({
      white: images
    });
  });

  it("should group single color with images (out of order/backwards)", () => {
    const variants = [
      { id: 1, imageId: 3, etc: { color: "white", size: "small" } }
    ];
    const images = [
      { id: 1, ordering: 1 },
      { id: 2, ordering: 2 },
      { id: 2, ordering: 3 }
    ];

    const product = new Product({
      colors: ["white"],
      variants: variants,
      images: images
    });
    expect(product).toBeDefined();

    expect(product.photoGroups).toMatchObject({
      white: images
    });
  });

  it("should group multiple color with images", () => {
    const variants = [
      { id: 1, imageId: 1, etc: { color: "white", size: "small" } },
      { id: 2, imageId: 3, etc: { color: "yellow", size: "small" } }
    ];
    const images = [
      { id: 1, ordering: 1 },
      { id: 2, ordering: 2 },
      { id: 3, ordering: 3 },
      { id: 4, ordering: 4 }
    ];

    const product = new Product({
      colors: ["white", "yellow"],
      variants: variants,
      images: images
    });
    expect(product).toBeDefined();

    expect(product.photoGroups).toMatchObject({
      white: [images[0], images[1]],
      yellow: [images[2], images[3]]
    });
  });

  it("should group multiple color with images with extra images in between", () => {
    const variants = [
      { id: 1, imageId: 1, etc: { color: "white", size: "small" } },
      { id: 2, imageId: 3, etc: { color: "yellow", size: "small" } }
    ];
    const images = [
      { id: 1, ordering: 1 },
      { id: 2, ordering: 2 },
      { id: 3, ordering: 3 }
    ];

    const product = new Product({
      colors: ["white", "yellow"],
      variants: variants,
      images: images
    });
    expect(product).toBeDefined();

    expect(product.photoGroups).toMatchObject({
      white: [images[0], images[1]],
      yellow: [images[2]]
    });
  });
});
