import Product from "../Product";

it("should initialize without error", () => {
  const product = new Product({});
  expect(product).toBeDefined();
});

describe("Selected variant", () => {
  it("should select a variant based on selected color", () => {
    const variants = [
      { id: 1, etc: { color: "white" } },
      { id: 2, etc: { color: "black" } }
    ];

    const product = new Product(
      { colors: ["white", "black"], variants: variants },
      "black"
    );
    expect(product).toBeDefined();
    expect(product.selectedVariant.id).toEqual(2);
  });

  it("should select the lowest priced variant that's in stock", () => {
    const variants = [
      { id: 1, limits: 0, price: 1000, etc: { color: "black" } },
      { id: 2, limits: 0, price: 10, etc: { color: "black" } },
      { id: 3, limits: 1, price: 100, etc: { color: "black" } },
      { id: 4, limits: 1, price: 50, etc: { color: "black" } },
      { id: 5, limits: 1, price: 5000, etc: { color: "black" } }
    ];

    const product = new Product(
      { colors: ["black"], variants: variants },
      "black"
    );
    expect(product).toBeDefined();
    expect(product.selectedVariant.id).toEqual(4);
  });

  it("should select out of stock variant matching color even though there's cheaper and in stock variants (not matching color)", () => {
    const variants = [
      { id: 1, limits: 0, price: 10, etc: { color: "black" } },
      { id: 2, limits: 1, price: 100, etc: { color: "black" } },
      { id: 3, limits: 1, price: 50, etc: { color: "black" } },
      { id: 4, limits: 0, price: 10000, etc: { color: "white" } },
      { id: 5, limits: 1, price: 5000, etc: { color: "black" } }
    ];

    const product = new Product(
      { colors: ["black"], variants: variants },
      "white"
    );
    expect(product).toBeDefined();
    expect(product.selectedVariant.id).toEqual(4);
  });

  it("should select the lowest priced variant based on selected color that's in stock", () => {
    const variants = [
      { id: 1, limits: 0, price: 1000, etc: { color: "black" } },
      { id: 2, limits: 0, price: 10, etc: { color: "black" } },
      { id: 3, limits: 1, price: 10000, etc: { color: "black" } },
      { id: 4, limits: 1, price: 50, etc: { color: "white" } },
      { id: 5, limits: 1, price: 5000, etc: { color: "black" } }
    ];

    const product = new Product(
      { colors: ["black"], variants: variants },
      "black"
    );
    expect(product).toBeDefined();
    expect(product.selectedVariant.id).toEqual(5);
  });

  it("should select a variant based on selected color that's in stock", () => {
    const variants = [
      { id: 1, limits: 0, etc: { color: "black" } },
      { id: 2, limits: 1, etc: { color: "black" } }
    ];

    const product = new Product(
      { colors: ["black"], variants: variants },
      "black"
    );
    expect(product).toBeDefined();
    expect(product.selectedVariant.id).toEqual(2);
  });

  it("should select an in stock variant", () => {
    const variants = [
      { id: 1, limits: 0, etc: { color: "white" } },
      { id: 2, limits: 1, etc: { color: "black" } }
    ];

    const product = new Product({
      colors: ["white", "black"],
      variants: variants
    });
    expect(product).toBeDefined();
    expect(product.selectedVariant.id).toEqual(2);
  });

  it("should select an in stock variant if color could not be matched", () => {
    const variants = [
      { id: 1, limits: 0, etc: { color: "white" } },
      { id: 2, limits: 1, etc: { color: "black" } }
    ];

    const product = new Product(
      { colors: ["white", "black"], variants: variants },
      "red"
    );
    expect(product).toBeDefined();
    expect(product.selectedVariant.id).toEqual(2);
  });

  it("should select the first variant if color nor stock could be matched", () => {
    const variants = [
      { id: 1, limits: 0, etc: { color: "white" } },
      { id: 2, limits: 0, etc: { color: "black" } }
    ];

    const product = new Product(
      { colors: ["white", "black"], variants: variants },
      "red"
    );
    expect(product).toBeDefined();
    expect(product.selectedVariant.id).toEqual(1);
  });
});

describe("Photo Groups", () => {
  it("should return all photos when no variant is given", () => {
    const images = [
      { id: 1, ordering: 1 },
      { id: 2, ordering: 2 },
      { id: 2, ordering: 3 }
    ];

    const product = new Product({ images: images });
    expect(product).toBeDefined();
    expect(product.photoGroups).toMatchObject({
      _common: images
    });

    // and associated photos
    expect(product.associatedPhotos).toMatchObject(images);
  });

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

  it("should group single color with no images and fallback to _common", () => {
    const variants = [{ id: 1, etc: { color: "white", size: "small" } }];
    const images = [];

    const product = new Product({
      colors: ["white"],
      variants: variants,
      images: images
    });
    expect(product).toBeDefined();

    expect(product.photoGroups).toMatchObject({
      white: images,
      _common: images
    });

    expect(product.associatedPhotos).toEqual(images);
  });

  it("should trigger fail safe if no _common and no associated images", () => {
    const variants = [
      {
        id: 1921026,
        limits: 305,
        description: "Black / M",
        price: 24.99,
        prevPrice: 34.99,
        etc: {
          prc: 0,
          prv: 0,
          sku: "6396774-black-m",
          size: "m",
          color: "black"
        }
      },
      {
        id: 1921025,
        limits: 136,
        description: "Black / L",
        price: 24.99,
        prevPrice: 34.99,
        etc: {
          prc: 0,
          prv: 0,
          sku: "6396774-black-l",
          size: "l",
          color: "black"
        }
      },
      {
        id: 1921024,
        limits: 274,
        description: "Black / XS",
        price: 24.99,
        prevPrice: 34.99,
        etc: {
          prc: 0,
          prv: 0,
          sku: "6396774-black-xs",
          size: "xs",
          color: "black"
        }
      },
      {
        id: 1921023,
        limits: 231,
        description: "Black / S",
        price: 24.99,
        prevPrice: 34.99,
        etc: {
          prc: 0,
          prv: 0,
          sku: "6396774-black-s",
          size: "s",
          color: "black"
        }
      },
      {
        id: 1921022,
        limits: 158,
        description: "Burgundy / M",
        price: 24.99,
        prevPrice: 34.99,
        etc: {
          prc: 0,
          prv: 0,
          sku: "6396774-burgundy-m",
          size: "m",
          color: "burgundy"
        },
        imageId: 209679
      },
      {
        id: 1921021,
        limits: 161,
        description: "Burgundy / L",
        price: 24.99,
        prevPrice: 34.99,
        etc: {
          prc: 0,
          prv: 0,
          sku: "6396774-burgundy-l",
          size: "l",
          color: "burgundy"
        },
        imageId: 209679
      },
      {
        id: 1921020,
        limits: 142,
        description: "Burgundy / XS",
        price: 24.99,
        prevPrice: 34.99,
        etc: {
          prc: 0,
          prv: 0,
          sku: "6396774-burgundy-xs",
          size: "xs",
          color: "burgundy"
        },
        imageId: 209679
      },
      {
        id: 1921019,
        limits: 244,
        description: "Burgundy / S",
        price: 24.99,
        prevPrice: 34.99,
        etc: {
          prc: 0,
          prv: 0,
          sku: "6396774-burgundy-s",
          size: "s",
          color: "burgundy"
        },
        imageId: 209679
      }
    ];
    const images = [
      {
        id: 209679,
        productId: 271762,
        imageUrl:
          "https://cdn.shopify.com/s/files/1/1602/6459/products/product-image-334659655.jpg",
        ordering: 1,
        width: 600,
        height: 600,
        score: 0
      },
      {
        id: 209680,
        productId: 271762,
        imageUrl:
          "https://cdn.shopify.com/s/files/1/1602/6459/products/product-image-412518514.jpg",
        ordering: 2,
        width: 800,
        height: 800,
        score: 1
      },
      {
        id: 209681,
        productId: 271762,
        imageUrl:
          "https://cdn.shopify.com/s/files/1/1602/6459/products/product-image-280994220.jpg",
        ordering: 3,
        width: 800,
        height: 800,
        score: 1
      },
      {
        id: 209682,
        productId: 271762,
        imageUrl:
          "https://cdn.shopify.com/s/files/1/1602/6459/products/product-image-412518518.jpg",
        ordering: 4,
        width: 800,
        height: 800,
        score: 1
      },
      {
        id: 209683,
        productId: 271762,
        imageUrl:
          "https://cdn.shopify.com/s/files/1/1602/6459/products/product-image-280994222.jpg",
        ordering: 5,
        width: 800,
        height: 800,
        score: 1
      },
      {
        id: 209684,
        productId: 271762,
        imageUrl:
          "https://cdn.shopify.com/s/files/1/1602/6459/products/product-image-412518512.jpg",
        ordering: 6,
        width: 800,
        height: 800,
        score: 1
      },
      {
        id: 209685,
        productId: 271762,
        imageUrl:
          "https://cdn.shopify.com/s/files/1/1602/6459/products/product-image-280994221.jpg",
        ordering: 7,
        width: 800,
        height: 800,
        score: 1
      },
      {
        id: 209686,
        productId: 271762,
        imageUrl:
          "https://cdn.shopify.com/s/files/1/1602/6459/products/product-image-412518516.jpg",
        ordering: 8,
        width: 800,
        height: 800,
        score: 1
      },
      {
        id: 209687,
        productId: 271762,
        imageUrl:
          "https://cdn.shopify.com/s/files/1/1602/6459/products/product-image-280994219.jpg",
        ordering: 9,
        width: 800,
        height: 800,
        score: 1
      },
      {
        id: 209688,
        productId: 271762,
        imageUrl:
          "https://cdn.shopify.com/s/files/1/1602/6459/products/product-image-280994223.jpg",
        ordering: 10,
        width: 800,
        height: 800,
        score: 1
      }
    ];

    const product = new Product({
      colors: ["black", "burgundy"],
      variants: variants,
      images: images
    });
    expect(product).toBeDefined();

    expect(product.photoGroups).toMatchObject({
      burgundy: images,
      black: images,
      _common: []
    });
  });
});
