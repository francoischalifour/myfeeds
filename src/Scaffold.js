import glamorous from 'glamorous'

const gridProps = {
  display: 'grid',
  gridTemplateColumns: '360px auto',
  gridTemplateRows: 'auto',
  gridGap: 24,
  gridTemplateAreas: `"header header"
    "sidebar main"
    ". main"`,
}

const Scaffold = glamorous('div', { propsAreCssOverrides: true })(props =>
  Object.assign(
    {},
    {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '0 24px',
    },
    props.grid && gridProps
  )
)

export default Scaffold
