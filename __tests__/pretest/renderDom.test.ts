import '@testing-library/jest-dom';

function render(html: string) {
    const container = document.createElement('div')
    container.innerHTML = html
    const queryByTestId = (testId: string) =>
        container.querySelector(`[data-testid="${testId}"]`)

    document.body.innerHTML = ''
    document.body.appendChild(container)

    return { container, queryByTestId }
}

export { render }

describe('renderDom', () => {
    const html = [
        '<div>',
        '<button data-testid="delete-button" class="btn extra btn-danger">',
        'Delete item',
        '</button>',
        '<button data-testid="cancel-button">',
        'Cancel',
        '</button>',
        '<svg data-testid="svg-spinner" class="spinner clockwise">',
        '<path />',
        '</svg>',
        '<div data-testid="only-one-class" class="alone"></div>',
        '<div data-testid="no-classes"></div>',
        '</div>'
    ].join('');

    it('works', () => {
        const { queryByTestId } = render(html);

        expect(queryByTestId('delete-button')).toHaveClass('btn');
        expect(queryByTestId('delete-button')).toHaveClass('btn-danger');
        expect(queryByTestId('delete-button')).toHaveClass('extra');
        expect(queryByTestId('delete-button')).not.toHaveClass('xtra');
        expect(queryByTestId('delete-button')).not.toHaveClass('btn xtra');
        expect(queryByTestId('delete-button')).not.toHaveClass('btn', 'xtra');
        expect(queryByTestId('delete-button')).not.toHaveClass('btn', 'extra xtra');
        expect(queryByTestId('delete-button')).toHaveClass('btn btn-danger');
        expect(queryByTestId('delete-button')).toHaveClass('btn', 'btn-danger');
        expect(queryByTestId('delete-button')).toHaveClass( 'btn extra', 'btn-danger extra',);
        expect(queryByTestId('delete-button')).not.toHaveClass('btn-link');
        expect(queryByTestId('cancel-button')).not.toHaveClass('btn-danger');
        expect(queryByTestId('svg-spinner')).toHaveClass('spinner');
        expect(queryByTestId('svg-spinner')).toHaveClass('clockwise');
        expect(queryByTestId('svg-spinner')).not.toHaveClass('wise');
        expect(queryByTestId('no-classes')).not.toHaveClass();
        expect(queryByTestId('no-classes')).not.toHaveClass(' ');

    });
});