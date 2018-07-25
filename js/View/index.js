import View from './View';

export default function createView(controller) {
  const viewInstance = new View(controller);

  return {
    updateView: viewInstance.updateView,
  };
}
