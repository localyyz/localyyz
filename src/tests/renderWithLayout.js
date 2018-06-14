import Renderer from "react-test-renderer";
import ShallowRenderer from "react-test-renderer/shallow";

// constants
export const DEFAULT_TEST_LAYOUT = { width: 750, height: 1334 };

/** Renders a React Component with specified layout using onLayout callback */
export const renderWithLayout = (
  component: any,
  layout: { width?: number, height?: number },
  isShallow: boolean
) => {
  // create the component with renderer
  if (isShallow) {
    let shallowRenderer = new ShallowRenderer();
    shallowRenderer.render(component);
    component = shallowRenderer.getRenderOutput();
  } else {
    component = Renderer.create(component);
  }

  // create a nativeEvent with desired dimensions
  const mockNativeEvent = {
    nativeEvent: {
      layout:
        layout && (layout.width != null || layout.height != null)
          ? layout
          : DEFAULT_TEST_LAYOUT
    }
  };

  // manually trigger onLayout with mocked nativeEvent
  let componentInternals = isShallow ? component : component.toJSON();
  componentInternals
    && componentInternals.props
    && componentInternals.props.onLayout
    && componentInternals.props.onLayout(mockNativeEvent);

  // re-render
  return component;
};
