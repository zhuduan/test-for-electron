const shell = require('shelljs')

shell.echo('##########################')
shell.echo('#     Building spring    #')
shell.echo('##########################')

shell.cd('spring')
const mvnw = process.platform === 'win32' ? 'mvnw' : './mvnw'
if (shell.exec(mvnw + ' clean package').code !== 0) {
  shell.echo('Error: spring build failed')
  shell.exit(1)
}
