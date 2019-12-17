import 'jest-preset-angular';
import 'core-js/es7/reflect';
delete global.window.open;
global.window = Object.create(window);
global.window.open = jest.fn();
