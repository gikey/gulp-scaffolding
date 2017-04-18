import fs from 'fs';
import config from './config.json';

exports.init = (params, cb) => {
    let project = {
        dir: params.dir,
        js: params.js,
        image: params.image,
        style: params.style,
        mock: params.mock
    }
    if (!project.dir) {
        console.log(`${'*'.repeat(38)}\n New project name must be created!!! \n${'*'.repeat(38)}`)
    } else if (fs.existsSync(project.dir)) {
        console.log(`${'*'.repeat(32)}\nThe directory already exists !!!\n${'*'.repeat(32)}`)
    } else {
        config.push({"project":`${project.dir}`, "type": `${project.style}`});
        fs.writeFileSync('config.json', JSON.stringify(config), 'utf8');
        fs.mkdir(`${project.dir}`, (err) => {
            if (err) throw err;
            fs.writeFileSync(`${project.dir}/index.html`, `
              <!DOCTYPE html>
              <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                <title>${project.dir}</title>
                <link rel="stylesheet" href="css/style.css">
              </head>
              <body>
              <script src="js/index.js"></script>
              </body>
              </html>
            `);
            for (let d in project) {
                if (d != 'dir' && project[d]) {
                    fs.mkdirSync(`${project.dir}/${project[d]}`);
                    if (d == 'js') {
                        fs.writeFileSync(`${project.dir}/${project[d]}/index.js`, '')
                    } else if (d == 'style') {
                        let suffix = 'css';
                        if (project[d] == 'sass') {
                            suffix = 'scss'
                        } else if(project[d] == 'less') {
                            suffix = 'less'
                        } else if (project[d] == 'stylus') {
                            suffix = 'styl'
                        }
                        fs.writeFileSync(`${project.dir}/${project[d]}/style.${suffix}`, '');
                    } else if (d == 'mock') {
                        fs.writeFileSync(`${project.dir}/${project[d]}/data.json`, '{}');
                    }
                }
            }
            console.log(`${'*'.repeat(25)}\nInitialized successfully!\n${'*'.repeat(25)}`);
        });
    }
    return cb();
};

exports.clean = (project, cb) => {
    for(var i = 0; i < config.length; i++) {
        if(config[i].project == project) {
            break;
        }
    }
    config.splice(i, 1);
    fs.writeFileSync('config.json', JSON.stringify(config), 'utf8');
    return cb();
};
