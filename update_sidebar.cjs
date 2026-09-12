const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `                    )}
                  </div>
                </div>
              </>`;

const replacement = `                    )}
                  </div>
                  <div className="mt-auto p-4 text-center border-t border-primary-900/30">
                    <p className="text-xs text-gray-500 font-mono tracking-wider">
                      © Bara Official X Bara AI
                    </p>
                  </div>
                </div>
              </>`;

content = content.replace(targetStr, replacement);
fs.writeFileSync('src/App.tsx', content);
